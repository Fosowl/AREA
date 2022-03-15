const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },

    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    
    lastName: {
      type: String,
      max: 55,
      minlength: 3,
    },
    firstName: {
      type: String,
      max: 55,
      minlength: 3,
    },
    phoneNumber: {
      type: String,
      max: 10,
      minlength: 10,
    },
    picture: {
      type: String,
      default: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Circle-icons-profile.svg",
      max: 1024,
    },

    widgets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WidgetModel',
      },
    ],

    twitter: {
      user_id: {
        type: String,
      },
      token: {
        type: String,
      },
      token_secret: {
        type: String,
      },
      timestamp: {
        type: Number,
      },
    },

    gmail: {
      user_id: {
        type: String,
      },
      email: {
        type: String,
        validate: [isEmail],
      },

      history_id: {
        type: String,
      },
      token: {
        type: String,
      },
      refresh_token: {
        type: String,
      },
      expiry_date: {
        type: Number,
      },
    },

    calendar: {
      user_id: {
        type: String,
      },
      email: {
        type: String,
        validate: [isEmail],
      },

      token: {
        type: String,
      },
      refresh_token: {
        type: String,
      },
      expiry_date: {
        type: Number,
      },

      watch_expiry_date: {
        type: Number
      },

      event: {
        resource_id: {
          type: String,
        },
        channel_id: {
          type: String,
        },
        sync_token: {
          type: String,
        },
      },

      calendar_list: {
        resource_id: {
          type: String,
        },
        channel_id: {
          type: String,
        },
        sync_token: {
          type: String,
        },

        calendars: {
          type: mongoose.Schema.Types.Array,
          default: undefined,
        },
      }
    },


    drive: {
      user_id: {
        type: String,
      },
      email: {
        type: String,
        validate: [isEmail],
      },

      token: {
        type: String,
      },
      refresh_token: {
        type: String,
      },
      expiry_date: {
        type: Number,
      },

      changes: {
        resource_id: {
          type: String,
        },
        channel_id: {
          type: String,
        },
        sync_token: {
          type: String,
        },
        page_token: {
          type: String,
        },
        expiry_date: {
          type: Number
        },

        files: {
          type: mongoose.Schema.Types.Array,
          default: undefined,
        },
      }
    },
  },
  {
    timestamps: true,
  }
);

// Chiffrement du mot de passe
userSchema.pre("save", async function (next) {

    if (!this.isModified('password'))
    {
        return next();
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Incorrect Email");
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
