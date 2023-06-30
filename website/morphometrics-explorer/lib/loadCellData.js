import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import _ from 'lodash';

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

        // const object = new Jenks(output_1["tess_covered_area"].filter(item => typeof item === 'number'), 8).naturalBreak()

        function filterNumbers(data) {
            const numbers = [];
            for (const item of data) {
                try {
                    const number = parseFloat(item);
                    numbers.push(number);
                } catch (error) {
                    // Ignore elements that are not numbers
                }
            }
            return numbers;
        }

        output[fileName.slice(0, -4)] = _.mapValues(output_1, list => _.sampleSize(list, 400))
    })

    return output
}