import Badge from './Badge.jsx';

const variantMap = { CRITICAL: 'critical', HIGH: 'high', MODERATE: 'moderate', SAFE: 'safe', URGENT: 'urgent' };

const RiskBadge = ({ level, size = 'sm' }) => (
  <Badge variant={variantMap[level] || 'default'} size={size}>
    {level}
  </Badge>
);

export default RiskBadge;
