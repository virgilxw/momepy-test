#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import geopandas as gpd
import numpy as np
import pandas as pd
from tqdm.notebook import tqdm
from libpysal.weights import fuzzy_contiguity
import json
import dask
from dask import delayed, dataframe as dd
from dask.distributed import Client, LocalCluster
from dask.graph_manipulation import bind
import bokeh
import dask_geopandas as dgpd
from dask.diagnostics import ProgressBar
import glob
import dask.bag as db
from itertools import chain
import json
import pickle


# In[ ]:


# %%time
# for ch in range(10):
#     tess = gpd.read_parquet(f'./out/singapore/tess_chunk_{int(ch)}.pq')
#     tess = tess.reset_index(drop=True)
#     filler = pd.Series(range(len(tess[tess.uID.isna()])), index=tess[tess.uID.isna()].index) + ch * 100_000_000
#     tess['uID'] = tess.uID.fillna(filler)
#     tess.to_parquet(f'./out/singapore/tess_chunk_{int(ch)}.pq')


# In[ ]:


with open('./out/singapore/clustertess.json', 'r') as f:
    includes_dict = json.load(f)


# In[ ]:


chunks = gpd.read_parquet('./out/singapore/clusters.pq')


# In[ ]:


w = fuzzy_contiguity(chunks, buffering=True, buffer=1000)


# In[ ]:


ax = chunks.loc[w.neighbors[2]].plot()
chunks.loc[[2]].plot(ax=ax, color='r')


# In[ ]:


# daskCluster = LocalCluster(threads_per_worker=2,
#                 n_workers=8, memory_limit='100GB')

# client = Client(daskCluster)


# In[ ]:


def duplicates(tessellation):

    # Check for duplicates based on UID
    duplicates = tessellation[tessellation.duplicated(subset='uID', keep=False)]

    # duplicates.to_file( "./out/" + place + 'errors.shp', driver='ESRI Shapefile')

    # Print the duplicate rows
    if len(duplicates) > 0:
        raise Exception("Tesselation: Duplicate UID entries:")
    elif (tessellation["uID"].isnull().values.any()):
        raise Exception("uID column include invalid entries")
    else:
        print("combined_chunk no problems")
        return 0


# In[23]:


with LocalCluster(threads_per_worker=2,
                  n_workers=8,
                  memory_limit='100GB',
                  dashboard_address=':8787') as cluster:
    with Client(cluster) as client:

        queen_out = {}

        @delayed
        def neigh_look(cell_id, main_chunk_ids, combined_chunks):
            cell_poly = combined_chunks.loc[combined_chunks['uID'] == cell_id]
            neighbours = combined_chunks[~combined_chunks.geometry.disjoint(cell_poly)]
            return neighbours.uID.tolist()

        def expand_one_order(main_chunk_ids, added_cells_ids, order, combined_chunks):
            if order == 0:
                return main_chunk_ids
            
            if len(added_cells_ids) == 0:
                added_cells_ids = main_chunk_ids

            results = set(main_chunk_ids)
            
            chunk_size = 16
            added_cells_ids_chunks = [added_cells_ids[i:i+chunk_size] for i in range(0, len(added_cells_ids), chunk_size)]
            
            for sublist in added_cells_ids_chunks:
                
                delay_objs = [neigh_look(cell_id, main_chunk_ids, combined_chunks) for cell_id in sublist]
                new_results = dask.compute(delay_objs)        
                results.update(set(chain(*new_results[0])))
                
                new_results = []

            print("compute done this wave")

            expanded_cells = list(results)

            neighbouring_cells = [cell for cell in neighbouring_cells if cell not in main_chunk_ids]
            print("cells added this wave")
            
            return expand_one_order(expanded_cells, neighbouring_cells, order-1, combined_chunks)
            
        def process_chunk(n1, order, neighbours, chunk):
            main_chunk = gpd.read_parquet(f"./out/singapore/tess_chunk_{int(n1)}.pq")
            combined_chunks = main_chunk

            main_chunk_ids = list(main_chunk['uID'])
            results = []

            for n2 in neighbours:
                neigh_chunk = gpd.read_parquet(f"./out/singapore/tess_chunk_{int(n2)}.pq")
                combined_chunks = combined_chunks.append(neigh_chunk)

            combined_chunks = combined_chunks.reindex()
            
            buffer = gpd.GeoDataFrame(geometry = [chunk.boundary.buffer(4)[0]], crs=main_chunk.crs)
            
            # find the rows in main_chunk that intersect the buffered polygon
            intersecting_rows = gpd.sjoin(main_chunk, buffer, how='inner', op='intersects')
            
            out = expand_one_order(main_chunk_ids, intersecting_rows["uID"].tolist(), order, combined_chunks)
            
            # return out

        # for n1 in tqdm(range(10), total=10):
        #     queen_out[n1] = process_chunk(n1)

        file_pattern = "./out/singapore/tess_chunk_*.pq"
        file_list = glob.glob(file_pattern)
        num_files = len(file_list)

        # combined_chunks=[]
        # delayed_tasks = []
        # for n1 in range(num_files):
        #     delayed_task = process_chunk(n1, w, combined_chunks)
        #     delayed_tasks.append(delayed_task)

        #     results = delayed_tasks

        queen_out = [process_chunk(n1, 3, w.neighbors[n1], chunks.loc[[n1]]) for n1 in range(num_files)]


        for n1 in tqdm(range(num_files)):
            queen_out[n1].to_parquet(f"./out/singapore/queen_{int(n1)}.pq")
            
        daskCluster.close()
        client.shutdown()


# In[ ]:


# daskCluster.close()
# client.shutdown()


# In[ ]:


queen_out.to_parquet("./out/singapore/queen_areas.pq")

