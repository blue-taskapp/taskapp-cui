const TaskApp = require(".");
(async () => {
  const app = new TaskApp();
  //Googleカレンダーの予定が入っている時間は除外
  await app.applyGCal();
  //PCに保存されたデータを読みだす
  app.load();
  //予定の登録。これは2時間のhello worldという予定を入れる
  app.addPlan("hello world", 2, true);
  console.log(app.plans);
  //現在通知すべき予定のチェック
  app.checkPlan();
  console.log(app.plans);
})();
