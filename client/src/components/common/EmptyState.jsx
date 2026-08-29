import { AlertCircle } from 'lucide-react';

const EmptyState = ({ icon: Icon = AlertCircle, title = 'No data found', message = '', action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
      <Icon size={24} className="text-gray-500" />
    </div>
    <h3 className="text-base font-medium text-gray-300 mb-1">{title}</h3>
    {message && <p className="text-sm text-gray-500 max-w-xs">{message}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
