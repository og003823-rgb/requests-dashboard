// // NotificationDropdown.jsx

// import React, { useState, useRef, useEffect } from "react";
// import { useNotifications } from "../../context/NotificationsContext";

// // تحويل الـ timestamp لصيغة نسبية زي "5m ago"
// const getRelativeTime = (timestamp) => {
//   const diff = Date.now() - timestamp;
//   const minutes = Math.floor(diff / 60000);
//   if (minutes < 1) return "Just now";
//   if (minutes < 60) return `${minutes}m ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours}h ago`;
//   return `${Math.floor(hours / 24)}d ago`;
// };

// const NotificationDropdown = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const {
//     notifications,
//     unreadCount,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//   } = useNotifications();

//   // إغلاق القايمة لما تدوس في أي مكان برة
//   const dropdownRef = useRef(null);
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleMarkAllAsRead = () => {
//     markAllAsRead();
//   };

//   const handleClearNotification = (id, e) => {
//     e.stopPropagation();
//     deleteNotification(id);
//   };

//   return (
//     <div className="position-relative dropdown" ref={dropdownRef}>
//       {/* زر الإشعارات */}
//       <button
//         type="button"
//         className="btn btn-light position-relative rounded-circle p-2"
//         onClick={() => setIsOpen(!isOpen)}
//         title="Notifications"
//       >
//         <i className="bi bi-bell fs-5"></i>
//         {unreadCount > 0 && (
//           <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {/* القائمة المنسدلة للإشعارات */}
//       {isOpen && (
//         <div
//           className="dropdown-menu show position-absolute end-0 mt-2 shadow border-0 p-2"
//           style={{ width: "320px", zIndex: 1050 }}
//         >
//           <div className="d-flex justify-content-between align-items-center px-2 pb-2 border-bottom">
//             <h6 className="mb-0 fw-bold">Notifications</h6>
//             {unreadCount > 0 && (
//               <button
//                 type="button"
//                 className="btn btn-link btn-sm text-decoration-none p-0"
//                 onClick={handleMarkAllAsRead}
//               >
//                 Mark all as read
//               </button>
//             )}
//           </div>

//           <div className="notification-list py-2" style={{ maxHeight: "250px", overflowY: "auto" }}>
//             {notifications.length === 0 ? (
//               <div className="text-center text-muted py-3">No notifications</div>
//             ) : (
//               notifications.map((notif) => (
//                 <div
//                   key={notif.id}
//                   className={`dropdown-item px-3 py-2 rounded mb-1 d-flex justify-content-between align-items-start ${
//                     !notif.read ? "bg-light fw-bold" : ""
//                   }`}
//                   style={{ whiteSpace: "normal", cursor: "pointer" }}
//                   onClick={() => markAsRead(notif.id)}
//                 >
//                   <div>
//                     <p className="mb-1 small">{notif.text}</p>
//                     <small className="text-muted" style={{ fontSize: "11px" }}>
//                       {getRelativeTime(notif.timestamp)}
//                     </small>
//                   </div>
//                   <button
//                     type="button"
//                     className="btn-close btn-close-sm ms-2"
//                     aria-label="Close"
//                     onClick={(e) => handleClearNotification(notif.id, e)}
//                   ></button>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;