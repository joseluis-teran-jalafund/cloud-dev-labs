import { Link } from "react-router";

type DashboardCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  linkTo: string;
  linkText: string;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  linkTo,
  linkText,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
          {icon}
        </div>
      </div>
      <Link
        to={linkTo}
        className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        {linkText} →
      </Link>
    </div>
  );
};

export default DashboardCard;
