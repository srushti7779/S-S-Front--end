import { Router } from "express";

const app = Router();

app.use("/auth", require("./auth").default);
app.use("/files", require("./files").default);
app.use("/profile", require("./profile").default);
app.use("/folders", require("./folders").default);
app.use("/payments", require("./payments").default);
app.use("/plans", require("./plans").default);
app.use("/plans-activity", require("./planAcitivty").default);
app.use("/video-addons", require("./videoAddon").default);
app.use("/notifications", require("./notification").default);
app.use("/buddies", require("./buddies").default);
app.use("/permissions", require("./permissions").default);
app.use("/storage-addons", require("./storageAddon").default);
app.use("/password-type/bank-password", require("./bankAccount").default);
app.use("/password-type/loan-account", require("./loanAccout").default);
app.use(
  "/password-type/password-non-bank",
  require("./passwordNonBank").default
);
app.use("/password-type/credit-card", require("./creditCard").default);
app.use(
  "/password-type/merchant-account",
  require("./merchantAccount").default
);
app.use("/password-type/recipe-account", require("./recipe").default);
app.use("/password-type/misc-password", require("./miscPassWord").default);
app.use("/verification", require("./verification").default);

export default app;
