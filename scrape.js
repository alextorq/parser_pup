const puppeteer = require('puppeteer');



function jsonToHTML (data) {
    let result = [];
    for (let job of data) {
        let title = `<b>${job.title}</b>`;
        let price = `<b>${job.price}</b>`;

        let skills = job.skills;
        let skillsList = '';
        for (let skill of skills) {
            skillsList += `<i>${skill}</i>\n`
        }

        result.push(title, price, skillsList)
    }
    return result.join('\n');
}

let scrape = async function() {
    let debug = false;
    const browser = await puppeteer.launch({
        headless: !debug
    });
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (request.resourceType() === 'document') {
            request.continue();
        } else {
            request.abort();
        }
    });

    await page.goto('https://moikrug.ru/vacancies?divisions%5B%5D=frontend&skills%5B%5D=1118&currency=rur&location=%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3&city_id=679');
    await page.setViewport({ width: 1920, height: 984 });
    await page.waitForSelector('#jobs_list');

    let result = await page.evaluate(() => {

        function getSkills(skills) {
            let skillsData = [];
            skills = Array.from(skills);
            for (let skill of skills){
                let skillCaption = skill.innerText;
                skillsData.push(skillCaption)
            }
            return skillsData;
        }

        let data = []; // Создаём пустой массив для хранения данных
        let elements = document.querySelectorAll('.jobs .job');

        for (let element of elements){ // Проходимся в цикле по каждому
            let title = element.querySelector('.title a'); // Выбираем название
            if (title) {
                title= title.innerText
            }
            let price = element.querySelector('.count'); // Выбираем цену
            if (price) {
                price = price.innerText;
            }
            let skillsElement = element.querySelectorAll('.skills .skill');
            let skills = getSkills(skillsElement);
            data.push({title, price, skills}); // Помещаем объект с данными в массив
        }
        return data;
    });

    await browser.close();
    return result;
};

module.exports.scrape = scrape;
module.exports.jsonToHTML = jsonToHTML;