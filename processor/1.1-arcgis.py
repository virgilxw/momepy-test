import arcpy

# Set the workspace to the directory containing the shapefile
arcpy.env.workspace = r"\\wsl.localhost\Ubuntu\home\virgilxw\repo\momepy-test\processor\out\singapore"

# Define the name and path of the shapefile
shapefile = "streets_raw.shp"
shapefile_path = arcpy.env.workspace + "\\" + shapefile

# Get the current project and map
aprx = arcpy.mp.ArcGISProject(r"\\wsl.localhost\Ubuntu\home\virgilxw\repo\momepy-test\Workfile\Workfile.aprx")
map = aprx.listMaps()[0]

# Create a feature layer from the shapefile
streets_raw = arcpy.management.MakeFeatureLayer(shapefile_path, "streets_raw")

# Save the project
aprx.save()

# Define the input feature class or table
input_layer = "streets_raw"

# Define the name and data type of the new field
new_field_name = "IsMotorway"
new_field_type = "SHORT"

# Add the new field to the input layer
arcpy.AddField_management(input_layer, new_field_name, new_field_type)

# Calculate the values for the new field using the values from the "is_motorwa" column
expression = "int(!is_motorwa!)"
arcpy.CalculateField_management(input_layer, new_field_name, expression, "PYTHON3")

# Define the input feature class or table
input_layer = "streets_raw"

# Define the name and data type of the new field
new_field_name = "IsRound"
new_field_type = "SHORT"

# Add the new field to the input layer
arcpy.AddField_management(input_layer, new_field_name, new_field_type)

# Calculate the values for the new field using the values from the "is_motorwa" column
expression = "int(!is_roundab!)"
arcpy.CalculateField_management(input_layer, new_field_name, expression, "PYTHON3")

# Define the input feature class or table
input_layer = "streets_raw"

# Define the name and data type of the new field
new_field_name = "allones"
new_field_type = "SHORT"

# Add the new field to the input layer
arcpy.AddField_management(input_layer, new_field_name, new_field_type)

# Calculate the values for the new field using the values from the "is_motorwa" column
expression = "1"
arcpy.CalculateField_management(input_layer, new_field_name, expression, "PYTHON3")

# Define the input feature class or table
input_layer = "streets_raw"

# Define the name and data type of the new field
new_field_name = "roadchar"
new_field_type = "SHORT"

# Add the new field to the input layer
arcpy.AddField_management(input_layer, new_field_name, new_field_type)

# Calculate the values for the new field using the values from the "is_motorwa" column
expression = "int(!road_char_!)"
arcpy.CalculateField_management(input_layer, new_field_name, expression, "PYTHON3")

# Define the input feature class or table
input_layer = "streets_raw"

# Define the name and data type of the new field
new_field_name = "hightype"
new_field_type = "SHORT"

# Add the new field to the input layer
arcpy.AddField_management(input_layer, 
                          new_field_name, new_field_type)

# Calculate the values for the new field using the values from the "is_motorwa" column
expression = "int(!highway_ty!)"
arcpy.CalculateField_management(input_layer, new_field_name, expression, "PYTHON3")

arcpy.cartography.MergeDividedRoads(
    in_features="streets_raw",
    merge_field="hightype",
    merge_distance="30 Meters",
    out_features=r"\\wsl.localhost\Ubuntu\home\virgilxw\repo\momepy-test\Workfile\Workfile.gdb\merge_divided_road",
    out_displacement_features=None,
    character_field="roadchar",
    out_table=None
)

arcpy.cartography.MergeDividedRoads(
    in_features="merge_divided_road",
    merge_field="IsPrimary",
    merge_distance="60 Meters",
    out_features=r"\\wsl.localhost\Ubuntu\home\virgilxw\repo\momepy-test\Workfile\Workfile.gdb\merge_primary",
    out_displacement_features=None,
    character_field="roadchar",
    out_table=None
)

arcpy.cartography.MergeDividedRoads(
    in_features="merge_primary",
    merge_field="IsMotorway",
    merge_distance="60 Meters",
    out_features=r"\\wsl.localhost\Ubuntu\home\virgilxw\repo\momepy-test\Workfile\Workfile.gdb\merge_motorway",
    out_displacement_features=None,
    character_field="roadchar",
    out_table=None
)

arcpy.conversion.FeatureClassToShapefile(
    Input_Features="merge_motorway",
    Output_Folder=r"\\wsl.localhost\Ubuntu\home\virgilxw\repo\momepy-test\processor\out\singapore"
)