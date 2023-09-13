/**
 * cron: 0 0 * * *
 *
 * 描述巴拉巴拉
 */
const Env = require('./env');
const $ = new Env('脚本名字');
const ENV = '环境变量名字';

!(async () => {
    // 代码开始
    if (process.env[ENV] != '1') {
        return;
    }

})()
    .catch((e) => {
        $.logErr(e);
    })
    .finally(() => {
        $.done();
    });

// prettier-ignore
