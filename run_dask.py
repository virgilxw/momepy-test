from dask.distributed import Client, LocalCluster

daskCluster = LocalCluster(threads_per_worker=2,
                n_workers=8, memory_limit='100GB',
                dashboard_address=':8787')

client = Client(daskCluster)