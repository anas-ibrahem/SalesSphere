import React from 'react';
import {BadgeTypes , TargetTypes} from "../../utils/Enums";
import { 
    Star, Medal, UserPlus, TrendingUp, BarChart2, List, X, User, UsersRound, 
    Trophy, Target, HandCoins, DollarSign, MapPin, Calendar, Flag, BookCheck, 
    Rocket, Clock, CheckCircle2, AlertCircle, Briefcase 
  } from "lucide-react";

import { BadgeIcons, TargetIcons } from "../../utils/Enums";

const getBadgeTypeName = (typeValue) => {
    return Object.keys(BadgeTypes).find(key => BadgeTypes[key] === typeValue) || "Unknown";
};

const DetailModal = ({ title, data, onClose, type }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          {type === 'badge' && (
            <div>
              {data.map((badge, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center mb-2">
                    {React.createElement(BadgeIcons[badge.type] || Star, { className: "w-6 h-6 mr-2 text-blue-500" })}
                    <h3 className="text-lg font-semibold">{badge.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Awarded: {new Date(badge.date_awarded).toLocaleDateString()}</p>
                    <p>Type: {getBadgeTypeName(badge.type)}</p>
                    <p>Required : {badge.required_points}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {type === 'target' && (
            <div>
              {data.map((target, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center mb-2">
                    {React.createElement(TargetIcons[target.type] || Briefcase, { className: "w-6 h-6 mr-2 text-purple-500" })}
                    <h3 className="text-lg font-semibold">Target Details</h3>
                  </div>
                  <div className="text-sm">
                    <p className="mb-2">{target.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Goal</p>
                        <p>{target.goal}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Progress</p>
                        <p>{target.progress} / {target.goal}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p>{new Date(target.start_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Deadline</p>
                        <p>{new Date(target.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  export default DetailModal;