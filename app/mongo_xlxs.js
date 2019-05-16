var model = null;
var xlsx = './sms_log.xlsx';

mongoxlsx.xlsx2MongoData(xlsx, model, function (err, data) {
  console.log(data);
});