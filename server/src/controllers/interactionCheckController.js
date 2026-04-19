const { checkInteractionsByNames } = require("../services/rxnormService");

exports.checkInteraction = async (req, res, next) => {
  try {
    let names = req.body?.medicineNames ?? req.body?.names;
    if (typeof names === "string") {
      names = [names];
    }
    if (!Array.isArray(names)) {
      return res.status(400).json({
        error: "Request body must include medicineNames: string[]",
      });
    }

    const result = await checkInteractionsByNames(names);
    res.json(result);
  } catch (err) {
    const code = err.statusCode || 500;
    if (code >= 500) {
      console.error("[check-interaction]", err.message);
    }
    return res.status(code).json({
      error: err.message || "Interaction check failed",
    });
  }
};
