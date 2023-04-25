import numpy as np
from numpy.lib import NumpyVersion
import pandas as pd
import scipy as sp
from tqdm.auto import tqdm  # progress bar
import warnings
import dask
from dask.distributed import Client, LocalCluster

class Percentiles:
    """
    Calculates the percentiles of values within neighbours defined in
    ``spatial_weights``.
    Parameters
    ----------
    gdf : GeoDataFrame
        GeoDataFrame containing source geometry
    values : str, list, np.array, pd.Series
        the name of the dataframe column, ``np.array``, or ``pd.Series``
        where is stored character value.
    spatial_weights : libpysal.weights
        spatial weights matrix
    unique_id : str
        name of the column with unique id used as ``spatial_weights`` index
    percentiles : array-like (default [25, 50, 75])
        percentiles to return
    interpolation : {'linear', 'lower', 'higher', 'midpoint', 'nearest'}
        This optional parameter specifies the interpolation method to
        use when the desired percentile lies between two data points
        ``i < j``:
        * ``'linear'``
        * ``'lower'``
        * ``'higher'``
        * ``'nearest'``
        * ``'midpoint'``
        See the documentation of ``numpy.percentile`` for details.
    verbose : bool (default True)
        if True, shows progress bars in loops and indication of steps
    weighted : {'linear', None} (default None)
        Distance decay weighting. If None, each neighbor within
        `spatial_weights` has equal weight. If `linear`, linear
        inverse distance between centroids is used as a weight.
    Attributes
    ----------
    frame : DataFrame
        DataFrame containing resulting values
    gdf : GeoDataFrame
        original GeoDataFrame
    values : Series
        Series containing used values
    sw : libpysal.weights
        spatial weights matrix
    id : Series
        Series containing used unique ID
    Examples
    --------
    >>> sw = momepy.sw_high(k=3, gdf=tessellation_df, ids='uID')
    >>> percentiles_df = mm.Percentiles(tessellation_df,
    ...                                 'area',
    ...                                 sw,
    ...                                 'uID').frame
    100%|██████████| 144/144 [00:00<00:00, 722.50it/s]
    """

    def __init__(
        self,
        gdf,
        values,
        spatial_weights,
        unique_id,
        percentiles=[25, 50, 75],
        interpolation="midpoint",
        verbose=True,
        weighted=None,
        client=None,
    ):
        self.gdf = gdf
        self.sw = spatial_weights
        self.id = gdf[unique_id]
        self.client = client

        data = gdf.copy()

        if values is not None:
            if not isinstance(values, str):
                data["mm_v"] = values
                values = "mm_v"
        self.values = data[values]

        results_list = []

        if weighted == "linear":
            data = data.set_index(unique_id)[[values, data.geometry.name]]
            data.geometry = data.centroid
            
            @dask.delayed
            def process_geom(i, geom, spatial_weights, data, percentiles, values):
                if i in spatial_weights.neighbors.keys():
                    neighbours = spatial_weights.neighbors[i]

                    vicinity = data.loc[neighbours]
                    distance = vicinity.distance(geom)
                    distance_decay = 1 / distance
                    vals = vicinity[values].values
                    sorter = np.argsort(vals)
                    vals = vals[sorter]
                    nan_mask = np.isnan(vals)
                    if nan_mask.all():
                        results_list.append(np.array([np.nan] * len(percentiles)))
                    else:
                        sample_weight = distance_decay.values[sorter][~nan_mask]
                        weighted_quantiles = (
                            np.cumsum(sample_weight) - 0.5 * sample_weight
                        )
                        weighted_quantiles /= np.sum(sample_weight)
                        interpolate = np.interp(
                            [x / 100 for x in percentiles],
                            weighted_quantiles,
                            vals[~nan_mask],
                        )
                        return interpolate
                else:
                    return np.array([np.nan] * len(percentiles))
            
            
            spatial_weights_scattered = client.scatter(spatial_weights)
            data_scattered = client.scatter(data)
            values_scattered = client.scatter(values)
            
            delayed_obj = []
            
            for i, geom in data.geometry.iteritems():
                delayed_obj.append(process_geom(i, geom, spatial_weights_scattered, data_scattered, percentiles, values_scattered))
                
            results_list = dask.compute(*delayed_obj)
            self.frame = pd.DataFrame(
                results_list, columns=percentiles, index=gdf.index
            )

        elif weighted is None:
            data = data.set_index(unique_id)[values]
            
            @dask.delayed
            def process (index, spatial_weights, data, percentiles, method):
                if index in spatial_weights.neighbors.keys():
                    neighbours = [index]
                    neighbours += spatial_weights.neighbors[index]
                    values_list = data.loc[neighbours]
                    with warnings.catch_warnings():
                        warnings.filterwarnings(
                            "ignore", message="All-NaN slice encountered"
                        )
                        return np.nanpercentile(values_list, percentiles, **method)
                else:
                    return np.nan

            if NumpyVersion(np.__version__) >= "1.22.0":
                method = dict(method=interpolation)
            else:
                method = dict(interpolation=interpolation)
                
            spatial_weights_scattered = client.scatter(spatial_weights)
            data_scattered = client.scatter(data)
            
            delayed_obj = []
            
            for index in data.index:
                delayed_obj.append(process(index, spatial_weights_scattered, data_scattered, percentiles, method))
                
            results_list = dask.compute(*delayed_obj)
                

            self.frame = pd.DataFrame(
                results_list, columns=percentiles, index=gdf.index
            )

        else:
            raise ValueError(f"'{weighted}' is not a valid option.")