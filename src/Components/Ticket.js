// Ticket.js

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faCog, faCheck } from "@fortawesome/free-solid-svg-icons";
import "./Ticket.css";

const Ticket = ({ ticket, user, nightMode }) => {
  // console.log("HELLO", nightMode);
  const getPriorityIcon = (priority) => {
    // You can customize the icon based on the priority level
    switch (priority) {
      case 0:
        return "🚀"; // Replace with your icon for No Priority
      case 1:
        return "⚪"; // Replace with your icon for Low Priority
      case 2:
        return "🔵"; // Replace with your icon for Medium Priority
      case 3:
        return "🔴"; // Replace with your icon for High Priority
      case 4:
        return "🔥"; // Replace with your icon for Urgent Priority
      default:
        return "";
    }
  };
  const getStatusIcon = (status) => {
    // Map ticket status to corresponding FontAwesome icons
    const statusIcons = {
      Backlog: <FontAwesomeIcon icon={faList} />,
      Todo: <FontAwesomeIcon icon={faCheck} />,
      "In progress": <FontAwesomeIcon icon={faCog} />,
    };

    return statusIcons[status] || "";
  };

  const ticketStyle = {
    // backgroundColor: nightMode ? "#2a2a2a" : "#ffffff", // Dark background color for night mode
    color: nightMode ? "#ffffff" : "#000000", // White font color for night mode
  };
  return (
    <div className="ticket" style={ticketStyle}>
      <div className="ticket-info">
        <div className="ticket-id">
          {getStatusIcon(ticket.status)} {ticket.id}
        </div>
        <div className="ticket-title">{ticket.title}</div>
        <div className="ticket-priority">
          {getPriorityIcon(ticket.priority)} {ticket.tag}
        </div>
      </div>
      {/* <div className="ticket-user">{user && <div>{user.name}</div>}</div> */}
    </div>
  );
};

export default Ticket;
