const mongoose = require("mongoose");

const ActionSchema = new mongoose.Schema(
    {
        service: {
            type: String,
            required: true
        },
        
        event: {
            type: String,
            required: true
        },

        data: {}
    },
    {
        _id: false
    }
);

const ReactionSchema = new mongoose.Schema(
    {
        service: {
            type: String,
            required: true
        },

        event: {
            type: String,
            required: true
        },

        data: {}
    },
    {
        _id: false
    }
);

const WidgetSchema = new mongoose.Schema(
  {
    account_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    action: ActionSchema,
    reaction: ReactionSchema,
  }
);

const WidgetModel = mongoose.model("widget", WidgetSchema);

module.exports = {
    WidgetModel,
}
