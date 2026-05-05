import React from "react";

const NotesCard = ({ note }) => {
  if (!note) return null;

  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-5 shadow-lg">
      <h3 className="text-xl font-semibold text-cyan-300 mb-3">
        {note.title || "Notes"}
      </h3>

      <p className="text-gray-200 leading-7 whitespace-pre-line">
        {note.content || "No notes available."}
      </p>
    </div>
  );
};

export default NotesCard;