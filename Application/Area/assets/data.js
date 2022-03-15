var types = {
  time: "time",
  date: "date",
  text: "string",
  boolean: "boolean",
};

let dataMatch = {
  scheduler: {
    actions: {
      every_hour: undefined,
      every_day: {
        hour: {
          type: types.time,
          pretty_name: "Time of Day",
          value: undefined,
          description:
            "Triggers relative to your timezone settings and defaults to UTC (GMT+00:00) if no preference is set.",
        },
      },
      every_week: {
        day: {
          type: types.date,
          pretty_name: "Day of the week",
          value: undefined,
        },
        hour: {
          type: types.time,
          pretty_name: "Time of Day",
          value: undefined,
          description:
            "Triggers relative to your timezone settings and defaults to UTC (GMT+00:00) if no preference is set.",
        },
      },
      every_month: {
        day: {
          type: types.date,
          pretty_name: "Day of the week",
          value: undefined,
        },
        hour: {
          type: types.time,
          pretty_name: "Time of Day",
          value: undefined,
          description:
            "Triggers relative to your timezone settings and defaults to UTC (GMT+00:00) if no preference is set.",
        },
      },
    },
    reactions: undefined,
  },
  twitter: {
    actions: {
      on_favorite: undefined,
      on_follow: undefined,
      on_unfollow: undefined,
      on_tweet_create: undefined,
    },
    reactions: {
      send_tweet: {
        text: {
          type: types.text,
          pretty_name: "Text to be send",
          value: undefined,
          description:
            "Tweet text. @mentions are not allowed. Character Limit is as set by Twitter",
        },
      },
      follow: {
        user_to_follow: {
          type: types.text,
          pretty_name: "Username of the user to follow",
          value: undefined,
          description: "Should not contain '@' before Username.",
        },
      },
      "update-profile-image": {
        image: {
          type: types.text,
          pretty_name: "Url to profile image",
          value: undefined,
          description: "Only a publicly accessible URL is allowed",
        },
      },
    },
  },
  gmail: {
    actions: {
      on_receive_new_mail: undefined,
      on_receive_new_mail_from: {
        from: {
          type: types.text,
          pretty_name: "From",
          value: undefined,
          description: "Write an email address",
        },
      },
      on_receive_new_mail_label: {
        label: {
          type: types.text,
          pretty_name: "Label/Mailbox",
          value: undefined,
        },
      },
      on_remove_mail: {
        label: {
          type: types.text,
          pretty_name: "Label/Mailbox",
          value: undefined,
        },
      },
      on_assign_label: {
        label: {
          type: types.text,
          pretty_name: "Label/Mailbox",
          value: undefined,
        },
      },
      on_remove_label: {
        label: {
          type: types.text,
          pretty_name: "Label/Mailbox",
          value: undefined,
        },
      },
    },
    reactions: {
      send_mail: {
        to: {
          type: types.text,
          pretty_name: "To",
          value: undefined,
          description:
            "The email address who you want to send the email. Multiple addresses not allowed",
        },
        subject: {
          type: types.text,
          pretty_name: "Subject",
          value: undefined,
        },
        message: {
          type: types.text,
          pretty_name: "Message",
          value: undefined,
        },
      },
      create_draft: {
        to: {
          type: types.text,
          pretty_name: "To",
          value: undefined,
          description:
            "The email address who you want to send the email. Multiple addresses not allowed",
        },
        subject: {
          type: types.text,
          pretty_name: "Subject",
          value: undefined,
        },
        message: {
          type: types.text,
          pretty_name: "Message",
          value: undefined,
        },
      },
      create_label: {
        name: {
          type: types.text,
          pretty_name: "Label name",
          value: undefined,
        },
      },
    },
  },
  calendar: {
    actions: {
      on_event_created: undefined,
      on_event_removed: undefined,
      on_calendar_created: undefined,
      on_calendar_removed: undefined,
    },
    reactions: {
      create_calendar: {
        name: {
          type: types.text,
          pretty_name: "Create a calendar",
          value: undefined,
        },
      },
      quick_add_event: {
        text: {
          type: types.text,
          pretty_name: "Event name",
          value: undefined,
        },
      },
      add_detailed_event: {
        start_date: {
          type: types.date,
          pretty_name: "Start date",
          value: undefined,
        },
        end_date: {
          type: types.date,
          pretty_name: "End date",
          value: undefined,
        },
      },
    },
  },
  drive: {
    actions: {
      on_any_file_created: undefined,
      on_any_removed: undefined,
    },
    reactions: {
      create_folder: {
        name: {
          type: types.text,
          pretty_name: "Create folder",
          value: undefined,
        },
      },
      create_file: {
        name: {
          type: types.text,
          pretty_name: "Create file",
          value: undefined,
        },
        content: {
          type: types.text,
          pretty_name: "Create new content",
          value: undefined,
        },
        convert_to_doc: {
          type: types.boolean,
          pretty_name: "Convert to document",
          value: undefined,
        },
      },
    },
  },
};

export default dataMatch;
