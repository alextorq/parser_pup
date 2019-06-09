const telegram = require('./telegram_bot');
let scrape = require('./scrape');
let jsonToHTML = scrape.jsonToHTML;
let scrapeFunc = scrape.scrape;

let token = '895481278:AAFSkBRQsbtWVjwYHfeGGtdKzxgNXrC_-7I';
let chat_id = '400327820';

let proxy = {
    host: 'ragnarok.imagespark.ru',
    port: 1080,
    user: 'tg',
    https: true,
    password: 'E32mHfxiuuV4Mb7rE2IbvAZETMc'
};

let api = new telegram({
    token: token,
    http_proxy: proxy,
    updates: {
        enabled: true
    }
});

api.on('message', function(message)
{
    let command = message.text;
    console.log(command);

    switch (command) {
        case '/getjob':
            scrapeFunc().then((value) => {
                let a = jsonToHTML(value);
                api.sendMessage({chat_id : chat_id, text: a.toString(), parse_mode: 'HTML'})
                    .catch(function(err)
                    {
                        console.log(err);
                    });

            }).catch((error) => {console.log(error)});
            break;
    }

});

// api.on('inline.query', function(message)
// {
//     // Received inline query
//     console.log(message);
// });

// api.on('inline.result', function(message)
// {
//     // Received chosen inline result
//     console.log(message);
// });

// api.on('inline.callback.query', function(message)
// {
//     // New incoming callback query
//     console.log(message);
// });

// api.on('edited.message', function(message)
// {
//     // Message that was edited
//     console.log(message);
// });

// api.on('update', function(message)
// {
//     // Generic update object
//     // Subscribe on it in case if you want to handle all possible
//     // event types in one callback
//     console.log(message);
// });

