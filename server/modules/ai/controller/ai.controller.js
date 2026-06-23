const {
  generatePropertyDescription,
  parseSearchQuery,
} = require("../services/ai.service");

const createDescription = async (req, res) => {
  try {
    const result = await generatePropertyDescription(req.body);

    res.json({
      success: true,
      description: result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate description",
    });
  }
};

const parseSearch = async (req, res) => {
  try {
    const query = req.body?.query || "";

    if (!query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const filters = await parseSearchQuery(query);

    res.json({
      success: true,
      query,
      filters,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to parse search query",
    });
  }
};

module.exports = {
  createDescription,
  parseSearch,
};
