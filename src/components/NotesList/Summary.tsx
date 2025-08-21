import { FaRegStickyNote } from "react-icons/fa";
import { FiCalendar, FiClock, FiCheckCircle } from "react-icons/fi";

type SummaryProps = {
  notesCount: number;
  notesThisWeek: number;
  upcomingReminders: number;
  pendingSync: number;
};

const items = [
  {
    label: "Notes totales",
    icon: <FaRegStickyNote className="text-lg text-gray-700 ml-2" />,
    key: "notesCount",
  },
  {
    label: "Créées cette semaine",
    icon: <FiCalendar className="text-lg text-gray-700 ml-2" />,
    key: "notesThisWeek",
  },
  {
    label: "Rappels à venir",
    icon: <FiClock className="text-lg text-gray-700 ml-2" />,
    key: "upcomingReminders",
  },
  {
    label: "En attente de synchronisation",
    icon: <FiCheckCircle className="text-lg text-gray-700 ml-2" />,
    key: "pendingSync",
  },
];

export default function Summary(props: SummaryProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-center mb-8">Aperçu de vos notes</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
        {items.map((item) => (
          <div key={item.key} className="bg-white rounded-lg p-6 shadow flex flex-col items-start justify-center">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-gray-500 font-medium">{item.label}</span>
              {item.icon}
            </div>
            <span className="text-3xl font-bold">{props[item.key as keyof SummaryProps]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}