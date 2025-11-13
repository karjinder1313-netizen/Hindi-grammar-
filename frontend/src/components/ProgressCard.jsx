import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const ProgressCard = ({ title, completed, total, icon: Icon, color = 'primary' }) => {
  const percentage = Math.round((completed / total) * 100);
  
  const colorClasses = {
    primary: 'from-primary to-secondary',
    accent: 'from-accent to-primary',
    success: 'from-success to-accent'
  };
  
  return (
    <Card className="p-6 space-y-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white`}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-foreground hindi-text">{title}</h3>
        </div>
        <span className="text-2xl font-bold text-foreground">{percentage}%</span>
      </div>
      
      <Progress value={percentage} className="h-2" />
      
      <p className="text-sm text-muted-foreground hindi-text">
        {completed} में से {total} पूर्ण
      </p>
    </Card>
  );
};