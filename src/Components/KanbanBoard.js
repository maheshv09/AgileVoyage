// KanbanBoard.js

import React, { useState, useEffect, useRef } from "react";
import Ticket from "./Ticket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSliders,
  faChevronDown,
  faMoon,
  faSun,
  faPlus,
  faEllipsisH,
  faList,
  faCheck,
  faCog,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./KanbanBoard.css";

const KanbanBoard = ({ tickets, users }) => {
  console.log("MKV", users.name);
  const [groupingOption, setGroupingOption] = useState("status");
  const [sortingOption, setSortingOption] = useState("none");
  const [groupedTickets, setGroupedTickets] = useState({});
  const [isDisplayOptionsVisible, setIsDisplayOptionsVisible] = useState(false);
  const [displayOption, setDisplayOption] = useState("grouping");
  const [nightMode, setNightMode] = useState(false);

  const statusIcons = {
    Backlog: <FontAwesomeIcon icon={faList} />,
    Todo: <FontAwesomeIcon icon={faCheck} />,
    "In progress": <FontAwesomeIcon icon={faCog} />,
    Done: <FontAwesomeIcon icon={faCheckCircle} />,
    Cancelled: <FontAwesomeIcon icon={faTimesCircle} />,
  };

  const toggleNightMode = () => {
    setNightMode(!nightMode);
  };

  const toggleDisplayOptions = () => {
    setIsDisplayOptionsVisible(!isDisplayOptionsVisible);
  };

  const handleGroupingChange = (option) => {
    setGroupingOption(option);
    setSortingOption("none"); // Reset sorting option when grouping changes
  };

  const handleSortingChange = (option) => {
    setSortingOption(option);
  };

  const displayOptionsRef = useRef();

  useEffect(() => {
    // Apply night mode styles
    const body = document.body;
    const kanbanBoard = document.querySelector(".kanban-board");
    const tickets = document.querySelectorAll(".kanban-list");

    if (nightMode) {
      body.style.backgroundColor = "#1a1a1a"; // Dark background color
      body.style.color = "#ffffff"; // White font color

      if (kanbanBoard) {
        kanbanBoard.style.backgroundColor = "#1a1a1a"; // Dark background color for kanban board
      }

      // if (tickets) {
      //   tickets.forEach((ticket) => {
      //     ticket.style.backgroundColor = "#2a2a2a"; // Dark background color for tickets
      //     ticket.style.color = "#ffffff"; // White font color for tickets
      //   });
      // }
    } else {
      body.style.backgroundColor = "#ffffff"; // Default background color
      body.style.color = "#000000"; // Default font color

      if (kanbanBoard) {
        kanbanBoard.style.backgroundColor = "#f1f4f7"; // Default background color for kanban board
      }

      // if (tickets) {
      //   tickets.forEach((ticket) => {
      //     ticket.style.backgroundColor = "#ffffff"; // Default background color for tickets
      //     ticket.style.color = "#000000"; // Default font color for tickets
      //   });
      // }
    }
  }, [nightMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDisplayOptionsVisible &&
        displayOptionsRef.current &&
        !displayOptionsRef.current.contains(event.target)
      ) {
        setIsDisplayOptionsVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDisplayOptionsVisible]);

  const groupTicketsByOption = (tickets, option) => {
    const grouped = {};
    let priorityGroups;
    if (option === "priority") {
      // Define the priorityGroups object
      priorityGroups = {
        0: "No Priority",
        1: "Low",
        2: "Medium",
        3: "High",
        4: "Urgent",
      };
    }

    tickets.forEach((ticket) => {
      let groupKey;

      if (option === "status") {
        groupKey = ticket[option];
      } else if (option === "user") {
        // Use the user name as the group key
        groupKey =
          users.find((user) => user.id === ticket.userId)?.name ||
          "Unknown User";
      } else if (option === "priority") {
        // Map priority values to corresponding group names
        groupKey = priorityGroups[ticket.priority] || "Unknown Priority";
      }

      if (!(groupKey in grouped)) {
        grouped[groupKey] = [];
      }

      grouped[groupKey].push(ticket);
    });
    if (option === "priority") {
      // Sort the keys based on the desired order
      const priorityOrder = ["No Priority", "Low", "Medium", "High", "Urgent"];
      const sortedKeys = Object.keys(grouped).sort(
        (a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b)
      );

      // Create a new object with sorted keys
      const sortedGrouped = {};
      sortedKeys.forEach((key) => {
        sortedGrouped[key] = grouped[key];
      });
      return sortedGrouped;
    }
    console.log("Grouped Tickets:", grouped);
    return grouped;
  };

  useEffect(() => {
    const grouped = groupTicketsByOption(tickets, groupingOption);

    // Ensure that all columns are present, even if there are no tickets
    const allGroups =
      groupingOption === "user"
        ? users.map((user) => user.name)
        : groupingOption === "status"
        ? ["Backlog", "Todo", "In progress", "Done", "Cancelled"]
        : [];

    allGroups.forEach((group) => {
      if (!grouped[group]) {
        grouped[group] = [];
      }
    });

    // Check if the grouped tickets are different before updating state
    if (JSON.stringify(grouped) !== JSON.stringify(groupedTickets)) {
      setGroupedTickets(grouped);
    }
  }, [tickets, groupingOption, users, groupedTickets]);

  const sortGroupedTickets = (groupedTickets, option) => {
    const sortedGroupedTickets = {};

    Object.keys(groupedTickets).forEach((group) => {
      const sortedGroup = groupedTickets[group].sort((a, b) => {
        if (option === "title") {
          // Sort by priority from highest to lowest
          return b.priority - a.priority;
        } else if (option === "priority") {
          // Sort by title
          return a.title.localeCompare(b.title);
        }
        return 0;
      });

      sortedGroupedTickets[group] = sortedGroup;
    });

    return sortedGroupedTickets;
  };

  useEffect(() => {
    // Check if the sorting option has changed before updating state
    if (sortingOption !== "none") {
      const sortedGroupedTickets = sortGroupedTickets(
        groupedTickets,
        sortingOption
      );

      // Check if the sorted grouped tickets are different before updating state
      if (
        JSON.stringify(sortedGroupedTickets) !== JSON.stringify(groupedTickets)
      ) {
        console.log("Updating groupedTickets state (sorting)"); // Log the update
        setGroupedTickets(sortedGroupedTickets);
      }
    }
  }, [sortingOption, groupedTickets]);

  function getInitials(name) {
    const names = name.split(" ");
    return names.length > 1
      ? names[0].charAt(0) + names[1].charAt(0)
      : names[0].charAt(0);
  }

  return (
    <div className="display-options relative mt-4 mb-8" ref={displayOptionsRef}>
      <div className="flex-container">
        <button
          className="button1 border p-1 w-35 flex items-center justify-between relative ml-4 inline-block"
          onClick={toggleDisplayOptions}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faSliders} className="mr-2" />
            Display
            <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
          </div>
        </button>

        <button
          className="button inline-block theme-switch"
          onClick={toggleNightMode}
        >
          <FontAwesomeIcon icon={nightMode ? faSun : faMoon} />
          {/* <FontAwesomeIcon icon={faMoon} /> */}
        </button>
      </div>

      {isDisplayOptionsVisible && (
        <div className="options-box absolute border p-2 mt-2 bg-white">
          <div className="grouping-options mb-2">
            <label className="mr-2" htmlFor="groupingDropdown">
              Group by:
            </label>
            <div className="inline-block dropdown-box">
              <select
                id="groupingDropdown"
                value={groupingOption}
                onChange={(e) => setGroupingOption(e.target.value)}
              >
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>

          <div className="sorting-options">
            <label className="mr-2" htmlFor="sortingDropdown">
              Sort by:
            </label>
            <div className="inline-block dropdown-box">
              <select
                id="sortingDropdown"
                value={sortingOption}
                onChange={(e) => setSortingOption(e.target.value)}
              >
                <option value="none">None</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="kanban-board mt-3">
        {/* Render columns based on the grouping option */}
        {groupingOption === "status" ? (
          <>
            {["Backlog", "Todo", "In progress", "Done", "Cancelled"].map(
              (status) => (
                <div key={status} className="kanban-column">
                  <div className="column-header">
                    <div className="header-content">
                      <h2>
                        {statusIcons[status]} {status} (
                        {groupedTickets[status]?.length || 0})
                      </h2>
                      <div className="icon-container">
                        <FontAwesomeIcon icon={faPlus} />
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </div>
                    </div>
                  </div>
                  {groupedTickets[status] &&
                    groupedTickets[status].map((ticket) => (
                      <div key={ticket.id} className="kanban-list">
                        <Ticket
                          ticket={ticket}
                          user={users.find((user) => user.id === ticket.userId)}
                          nightMode={nightMode}
                        />
                      </div>
                    ))}
                </div>
              )
            )}
          </>
        ) : (
          // Original logic for other grouping options
          Object.keys(groupedTickets).map((group) => (
            <div key={group} className="kanban-column">
              <div className="column-header">
                <div className="header-content">
                  <h2>
                    {group} ({groupedTickets[group].length})
                  </h2>

                  <div className="icon-container">
                    <FontAwesomeIcon icon={faPlus} />
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </div>
                </div>
              </div>
              {groupedTickets[group].map((ticket) => (
                <div key={ticket.id} className="kanban-list">
                  <Ticket
                    ticket={ticket}
                    user={users.find((user) => user.id === ticket.userId)}
                    nightMode={nightMode}
                  />
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
