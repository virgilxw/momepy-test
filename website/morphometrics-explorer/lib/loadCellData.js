import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import _ from 'lodash';

const postsDirectory = path.join(process.cwd(), 'city_data');

export async function loadCellData() {

    const fileNames = fs.readdirSync(postsDirectory);

    let output = {}

    fileNames.forEach((fileName) => {
        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        let output_1 = {}
        Papa.parse(fileContents, {
            header: true,
            complete: function (results) {
                results.data.forEach(row => {
                    for (const key in row) {
                        if (!output_1[key]) output_1[key] = [];
                        output_1[key].push(row[key]);
                    }
                });

            }
        })

        let city_name = fileName.split("-", 1)[0]

        if (city_name in output){
            for (const key in output_1){
                output[city_name][key] = (output[city_name][key] || []).concat(output_1[key])
            }
        } else {
            output[city_name] = output_1
        }
    })

    for (const key in output){
        output[key] = _.mapValues(output[key], list => _.sampleSize(list, 600))
    }

    return output
}