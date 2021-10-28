import React, { useState } from "react";
import Button from "../button/Button";
import DatePicker from "react-date-picker";
import User from "../users/User";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";

function TaskForm(props) {
  const userState = useSelector((state) => {
    return state.user;
  });

  const [name, setName] = useState(props.name || "");
  const [description, setDescription] = useState(props.description || "");
  const [startDate, onStart] = useState(props.startDate || new Date());
  const [endDate, onEnd] = useState(props.endDate || new Date());
  const [priority, setPriority] = useState(props.priority || 0);
  const [error, setError] = useState("");

  const { id, state, onSave, projectID, setEdit } = props;

  const team = state.projectTeams.filter((team) => {
    return team.projectId === projectID;
  });

  const usersList = [];

  for (const member of team) {
    for (const user of state.users) {
      if (user.id === member.userId) {
        usersList.push(user);
      }
    }
  }

  const usersListArray = usersList.map((user) => {
    const { id, name, avatar } = user;
    return <User key={id} id={id} avatar={avatar} name={name} />;
  });

  const validate = () => {
    const selectedUsers = document.getElementsByClassName(
      "user-list--selected"
    );

    const selectedUsersIDs = [];

    for (const user of selectedUsers) {
      selectedUsersIDs.push(user.id);
    }

    const task = {
      project_id: projectID,
      sprint_id: null,
      name,
      description,
      startDate,
      endDate,
      priority_level: priority,
      users: selectedUsersIDs,
    };

    setError("");
    // setEdit(false);
    onSave(task);
    document.getElementById(makeId(id)).close();
  };

  const cancel = () => {
    document.getElementById(makeId(id)).close();
    // setEdit(false);
  };

  const makeId = (id) => {
    return `dialog-dark-rounded-edit-${id}`;
  };

  return (
    <div>
      <BiEdit
        type="button"
        className="nes-btn is-primary"
        onClick={() => document.getElementById(makeId(id)).showModal()}
        title={"New Task"}
      ></BiEdit>
      <dialog className="nes-dialog is-dark is-rounded" id={makeId(id)}>
        <form
          className="form"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
          method="dialog"
        >
          <label>
            Task name:
            <input
              value={name}
              type="text"
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />
          </label>

          <label>
            Description:
            <textarea
              value={description}
              type="text"
              onChange={(e) => {
                setDescription(e.target.value);
                setError("");
              }}
            />
          </label>

          <div className="team-date-container">
            <label>
              Assignees:
              <ul className="rpgui users-container">{usersListArray}</ul>
            </label>

            <div className="date">
              <label>
                Start date:
                <DatePicker
                  onChange={onStart}
                  value={startDate}
                  className="date-size"
                />
              </label>

              <label>
                End date:
                <DatePicker
                  onChange={onEnd}
                  value={endDate}
                  className="date-size"
                />
              </label>
            </div>
          </div>
          <div className="cancel-submit">
            <Button onClick={cancel} title={"cancel"}></Button>
            <Button onClick={validate} title={"submit"}></Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

export default TaskForm;