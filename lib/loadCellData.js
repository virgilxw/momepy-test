import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import _ from 'lodash';

const postsDirectory = path.join(process.cwd(), 'city_data');

export async function* getFiles(directory) {
    for await (const dirent of await fs.promises.opendir(directory)) {
        yield dirent.name;
    }
}

export async function loadCellData() {

    let output = {}

    for await (const fileName of getFiles(postsDirectory)) {
        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);

        let city_name = fileName.split("-", 1)[0]
        if (!(city_name in output)){
            output[city_name] = {}
        }

        let fileStream = fs.createReadStream(fullPath, 'utf8')
        Papa.parse(fileStream, {
            header: true,
            step: function (result) {
                for (const key in result.data) {
                    output[city_name][key] = output[city_name][key] || [];
                    output[city_name][key].push(result.data[key]);
                }
            }
        })
    }

    for (const key in output){
        output[key] = _.mapValues(output[key], list => _.sampleSize(list, 600))
    }

    return output
}