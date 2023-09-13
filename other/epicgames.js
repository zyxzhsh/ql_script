/**
 * cron: 1 0 * * *
 *
 * 环境变量: EPIC_GAMES, 值: 1表示开启, 其他表示关闭
 */
const Env = require('./env');
const $ = new Env('Epic免费游戏');
const ENV = 'EPIC_GAMES';

!(async () => {
    if (process.env[ENV] != '1') {
        return;
    }
    const data = $.getdata($.name) || [];

    const axios = require('axios');
    const url = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US,CN';

    await axios.get(url).then(async (resp) => {
        let content = '';
        resp.data.data.Catalog.searchStore.elements.forEach((element) => {
            const promotions = element.promotions;
            if (promotions) {
                promotions.promotionalOffers.forEach((offers) => {
                    const offer = offers.promotionalOffers[0];
                    if (offer.discountSetting.discountPercentage == 0) {
                        if (!data.includes(element.title)) {
                            data.push(element.title);
                            content += `${element.title}, 截止: ${offer.endDate}\n`;
                            $.msg(`发现新游戏: ${element.title}, 截止: ${offer.endDate}`);
                        } else {
                            $.log(`已通知过: ${element.title}, 截止: ${offer.endDate}`);
                        }
                    }
                });
            }
        });
        if (content) {
            while (data.length > 5) data.shift(); // 最多保存5个
            await require('./sendNotify.js').sendNotify(`${$.name} 可领取`, content, {}, '').then(() => {
                $.setdata(data, $.name);
            });
        }
    });
})()
    .catch((e) => {
        $.logErr(e);
    })
    .finally(() => {
        $.done();
    });

