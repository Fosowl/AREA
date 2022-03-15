import React from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";

import api from "api/Api";
import { Account } from "api/Account";

import Header from "components/Header";
import IsLoadingHOC from "components/IsLoadingHOC";
import EditableText from "components/EditableText";
import { Button, TextField } from "@mui/material";

import { TouchableOpacity, ActionBlock } from "components";
import { CSSTransition } from "react-transition-group";
import { Images } from "Theme";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "./UpdateWidget.scss";

function UpdateWidget(props) {
  const { widget_id } = useParams();

  const [WidgetName, setWidgetName] = useState("Double click to rename me !");
  const [ServicesUsers, setServicesUsers] = useState([]);
  const [CurrentState, setCurrentState] = useState(undefined);

  const navigate = useNavigate();

  const [selectedAction, setActionSelected] = useState({
    action: undefined,
    service: undefined,
  });
  const [selectedReaction, setReactionSelected] = useState({});

  const { isLoading, setIsLoading } = props;
  const [isSwitch, setIsSwitch] = useState(true);

  // get availables services
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // redirect to login page
        navigate("/login");
        return;
      }

      const services = await api.service.available(token);
      const widget = await api.widget(token, widget_id);
      console.log(widget);
      setCurrentState(widget);
      setActionSelected({
        action: {
          name: widget.action.event,
          service: widget.action.service,
        },
      });

      setReactionSelected({
        action: {
          name: widget.reaction.event,
          service: widget.reaction.service,
        },
      });
      setServicesUsers(services);
      //setWidgetName(widget.name);
    })();
  }, []);

  useEffect(() => {
    updateActionInfo(ServicesUsers);
    updateReactionInfo(ServicesUsers);
    if (ServicesUsers.length > 0) setIsLoading(false);
  }, [ServicesUsers]);

  function updateActionInfo(services) {
    let service = services.find((service) => {
      return service.name == selectedAction.action.service;
    });

    if (!service) return;

    // setSelectedServiceAction(service)

    const action = service.actions.find((value) => {
      return value.name == selectedAction.action.name;
    });

    setActionSelected({
      ...selectedAction,
      service: service,
      action: {
        ...action,
        data: CurrentState.action.data,
      },
    });
  }

  function updateReactionInfo(services) {
    let service = services.find((service) => {
      return service.name == selectedReaction.action.service;
    });

    if (!service) return;

    const reaction = service.reactions.find((value) => {
      return value.name == selectedReaction.action.name;
    });

    setReactionSelected({
      ...selectedReaction,
      service: service,
      action: {
        ...reaction,
        data: CurrentState.reaction.data,
      },
    });
  }

  function onChangeAction(selected) {
    setActionSelected(selected);
  }

  function onChangeReaction(selected) {
    setReactionSelected(selected);
  }

  function updateWidgetRequest() {
    if (
      !selectedAction.service ||
      !selectedAction.action ||
      !selectedReaction.service ||
      !selectedReaction.action
    )
      return;

    const widget = {
      ...CurrentState,
      action: {
        service: selectedAction.service.name,
        event: selectedAction.action.name,
        data: selectedAction?.data,
      },
      reaction: {
        service: selectedReaction.service.name,
        event: selectedReaction.action.name,
        data: selectedReaction.data,
      },
    };

    console.log("Widget: ", widget);
    widget.update(widget);
  }

  function updateWidgetName(value) {
    let widget = CurrentState;

    setWidgetName(value);
    widget.name = value;
    widget.update();
  }

  return (
    <>
      <Header page="update_widget" />
      <div className="add-widget-page">
        {!isLoading && (
          <div>
            <div className="widget-name-container" style={{ width: "100%" }}>
              {/* <TextField
            id="standard-basic"
            label="Widget Name"
            variant="standard"
            className='widget-name-field'
            value={WidgetName}
            onChange={updateWidgetName}
          /> */}
              <div>
                <EditableText
                  display={WidgetName}
                  onInputChange={updateWidgetName}
                />
              </div>
              <Button
                className="save-button"
                style={{ backgroundColor: "#BD1919" }}
                onClick={updateWidgetRequest}
              >
                <p className="save-button-text" style={{ color: "white" }}>
                  Update
                </p>
              </Button>
            </div>
            <div className="panel-view" style={{ width: "70%", margin: 'auto', marginTop: 30 }}>
              <div>
                <img src={Images.when} className="when-image" style={{ marginLeft: 118 }} />

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
                      defaultValue={selectedAction}
                    />
                  </TouchableOpacity>
                </CSSTransition>
              </div>
              <div>
                <img src={Images.do} className="do-image" style={{ marginLeft: 275 }} />

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
                      defaultValue={selectedReaction}
                      label="Choose an Reaction"
                    />
                  </TouchableOpacity>
                </CSSTransition>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default IsLoadingHOC(UpdateWidget);
