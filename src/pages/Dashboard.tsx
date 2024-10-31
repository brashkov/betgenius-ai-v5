import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BarChart2, Calendar, TrendingUp, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Prediction {
  id: string;
  sport: string;
  event_date: string;
  home_team: string;
  away_team: string;
  prediction: string;
  confidence_score: number;
  odds: number;
  status: 'pending' | 'won' | 'lost';
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [todaysPredictions, setTodaysPredictions] = useState<Prediction[]>([]);
  const [pastPredictions, setPastPredictions] = useState<Prediction[]>([]);
  const [stats, setStats] = useState({
    totalPredictions: 0,
    successRate: 0,
    averageOdds: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch today's predictions
        const today = new Date().toISOString().split('T')[0];
        const { data: todayData, error: todayError } = await supabase
          .from('predictions')
          .select('*')
          .gte('event_date', today)
          .lte('event_date', today + 'T23:59:59')
          .order('event_date', { ascending: true });

        if (todayError) throw todayError;
        setTodaysPredictions(todayData || []);

        // Fetch past predictions
        const { data: pastData, error: pastError } = await supabase
          .from('predictions')
          .select('*')
          .lt('event_date', today)
          .order('event_date', { ascending: false })
          .limit(10);

        if (pastError) throw pastError;
        setPastPredictions(pastData || []);

        // Calculate statistics
        const totalPreds = pastData?.length || 0;
        const wonPreds = pastData?.filter(p => p.status === 'won').length || 0;
        const avgOdds = pastData?.reduce((acc, curr) => acc + curr.odds, 0) / totalPreds || 0;

        setStats({
          totalPredictions: totalPreds,
          successRate: totalPreds ? (wonPreds / totalPreds) * 100 : 0,
          averageOdds: avgOdds,
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const PredictionCard = ({ prediction }: { prediction: Prediction }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded capitalize bg-indigo-100 text-indigo-800 mb-2">
            {prediction.sport}
          </span>
          <h3 className="text-lg font-semibold text-gray-900">
            {prediction.home_team} vs {prediction.away_team}
          </h3>
        </div>
        <StatusBadge status={prediction.status} />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Prediction</span>
          <span className="font-medium">{prediction.prediction}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Confidence</span>
          <span className="font-medium">{prediction.confidence_score}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Odds</span>
          <span className="font-medium">{prediction.odds}</span>
        </div>
      </div>
    </div>
  );

  const StatusBadge = ({ status }: { status: Prediction['status'] }) => {
    const statusConfig = {
      pending: { icon: AlertCircle, className: 'bg-yellow-100 text-yellow-800' },
      won: { icon: CheckCircle2, className: 'bg-green-100 text-green-800' },
      lost: { icon: XCircle, className: 'bg-red-100 text-red-800' },
    };

    const Config = statusConfig[status];
    const Icon = Config.icon;

    return (
      <span className={cn('px-2 py-1 rounded-full flex items-center space-x-1', Config.className)}>
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold capitalize">{status}</span>
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Predictions Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Predictions</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalPredictions}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart2 className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.successRate.toFixed(1)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Odds</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.averageOdds.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Predictions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Predictions</h2>
          {todaysPredictions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todaysPredictions.map((prediction) => (
                <PredictionCard key={prediction.id} prediction={prediction} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500">No predictions available for today yet.</p>
            </div>
          )}
        </div>

        {/* Past Performance */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastPredictions.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;