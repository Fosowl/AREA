import React from "react";
import { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import Header from "components/Header";

import api from "api/Api";
import { TouchableOpacity, ActionBlock } from "components";
import { CSSTransition } from "react-transition-group";
import { Images } from "Theme";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "./AddWidget.scss";

function AddWidget() {
  const navigate = useNavigate();
  const [ServicesUsers, setServicesUsers] = useState([]);

  const [selectedAction, setActionSelected] = useState({});
  const [selectedReaction, setReactionSelected] = useState({});

  const [isSwitch, setIsSwitch] = useState(true);
  const [token, setToken] = useState(undefined);
  const [widgetName, setWidgetName] = useState("Name your widget");

  // get availables services
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.service.available(token).then((services) => {
        setServicesUsers(services);
      });
      setToken(token);
    } else {
      // redirect to login page
    }
  }, []);

  function onChangeAction(selected) {
    setActionSelected(selected);
  }

  function onChangeReaction(selected) {
    setReactionSelected(selected);
  }

  const onWidgetNameChange = (v) => {
    setWidgetName(v.target.value);
  };

  function onPressOkButton() {
    if (!selectedAction.service || !selectedAction.action) {
      toast.error("Invalid Action");
    }

    if (!selectedReaction.service || !selectedReaction.action) {
      toast.error("Invalid Reaction");
    }
    if (
      !selectedAction.service ||
      !selectedAction.action ||
      !selectedReaction.service ||
      !selectedReaction.action
    )
      return;

    const promise = api.widget.add(token, {
      name: widgetName,
      action: {
        service: selectedAction.service?.name,
        event: selectedAction.action?.name,
        data: selectedAction.data,
      },
      reaction: {
        service: selectedReaction.service?.name,
        event: selectedReaction.action?.name,
        data: selectedReaction.data,
      },
    });

    toast
      .promise(promise, {
        pending: "Wait...",
        success: "Widget Added 👌",
        // error: 'Promise rejected 🤯'
        error: {
          render({ data }) {
            // When the promise reject, data will contains the error
            // return <MyErrorComponent message={data.message} />
            return data.message;
          },

          icon: "🤯",
        },
      })
      .then(() => {
        navigate("/home");
      });
  }

  return (
    <>
      <Header page="add_widget" />
      <div className="add-widget-page">
        <div className="widget-name-container" style={{ width: "100%" }}>
          <TextField
            id="standard-basic"
            label="Widget Name"
            variant="standard"
            className="widget-name-field"
            value={widgetName}
            onChange={onWidgetNameChange}
          />
          <Button
            className="save-button"
            style={{ backgroundColor: "#BD1919" }}
            onClick={onPressOkButton}
          >
            <p className="save-button-text" style={{ color: "white" }}>
              Save
            </p>
          </Button>
        </div>
        <div className="panel-view" style={{ width: "70%" }}>
          <div>
            <img
              src={Images.when}
              className="when-image"
              style={{ marginLeft: 118 }}
            />

            <CSSTransition
              in={isSwitch}
              timeout={1000}
              classNames="touchable"
              appear={true}
            >
              <TouchableOpacity
                className={"action-box"}
                onClick={() => setIsSwitch(true)}
              >
                {/* If Block */}
                <ActionBlock
                  title={"Action"}
                  services={ServicesUsers}
                  onChange={onChangeAction}
                  label="Choose an Action"
                />
              </TouchableOpacity>
            </CSSTransition>
          </div>
          <div>
            <img
              src={Images.do}
              className="do-image"
              style={{ marginLeft: 275 }}
            />

            <CSSTransition
              in={!isSwitch}
              timeout={1000}
              classNames="touchable"
              appear
            >
              <TouchableOpacity
                className={"reaction-box"}
                onClick={() => setIsSwitch(false)}
              >
                {/* Then Block */}
                <ActionBlock
                  title={"Réaction"}
                  isReaction={true}
                  services={ServicesUsers}
                  onChange={onChangeReaction}
                  label="Choose an Reaction"
                />
              </TouchableOpacity>
            </CSSTransition>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddWidget;
