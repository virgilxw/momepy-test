import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import _ from 'lodash';

const fetchData = async () => {
    // // Fetch the CSV data and process it using Papa.parse
    // const response = await fetch('city_data/singapore.csv');
    // const reader = response.body.getReader();
    // const result = await reader.read();
    // const decoder = new TextDecoder('utf-8');
    // const csv = decoder.decode(result.value);

    // return new Promise((resolve, reject) => {
    //     Papa.parse(csv, {
    //         header: true,
    //         complete: function (results) {
    //             const output = {};
    //             results.data.forEach(row => {
    //                 for (const key in row) {
    //                     if (!output[key]) output[key] = [];
    //                     output[key].push(row[key]);
    //                 }
    //             });
    //             resolve(output); // resolve the Promise with the output
    //         },
    //         error: function (error) {
    //             reject(error); // reject the Promise if there's an error
    //         }
    //     });
    // });
}

const postsDirectory = path.join(process.cwd(), 'city_data');

export async function loadCellData() {

    const fileNames = fs.readdirSync(postsDirectory);

    let output = {}

    const allPostsData = fileNames.map((fileName) => {
        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        let output_1 = {}
        Papa.parse(fileContents, {
            header: true,
            complete: function (fileContents) {
                const output = {};
                fileContents.data.forEach(row => {
                    for (const key in row) {
                        if (!output_1[key]) output_1[key] = [];
                        output_1[key].push(row[key]);
                    }
                });

            }
        })

        output[fileName.slice(0, -4)] = _.mapValues(output_1,list => _.sampleSize(list, 200))
    })

    return output
}