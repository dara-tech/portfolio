import React, { useEffect, useState } from 'react';
import useProjects from '../hooks/useProjects';
import useVideo from '../hooks/useVideo';
import { useRoadMapByID } from '../hooks/useRoadMap';
import { Eye, Video as VideoIcon, Map, Calendar, Clock } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { videos, getAllVideos, loading: videosLoading } = useVideo();
  const { roadMaps, loading: roadmapsLoading } = useRoadMapByID();
  const [timeFilter, setTimeFilter] = useState('month');
  const [periodType, setPeriodType] = useState('fixed');
  const [customRange, setCustomRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [stats, setStats] = useState({
    totalViews: 0,
    totalVideoViews: 0,
    totalRoadmapViews: 0
  });

  useEffect(() => {
    getAllVideos();
  }, [getAllVideos]);

  const filterDataByTime = (data, dateField = 'createdAt') => {
    if (!data) return [];
    
    const now = new Date();
    let startDate, endDate;

    if (periodType === 'fixed') {
      startDate = new Date(customRange.start);
      endDate = new Date(customRange.end);
    } else {
      endDate = now;
      switch(timeFilter) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case 'quarter':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          break;
        case 'year':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        default:
          startDate = new Date(0);
      }
    }

    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  useEffect(() => {
    if (!projects || !videos?.data || !roadMaps) return;

    const filteredProjects = filterDataByTime(projects);
    const filteredVideos = filterDataByTime(videos.data);
    const filteredRoadmaps = filterDataByTime(roadMaps);

    const projectTotal = filteredProjects.reduce((sum, project) => sum + (project.views || 0), 0);
    const videoTotal = filteredVideos.reduce((sum, video) => sum + (video.views || 0), 0);
    const roadmapTotal = filteredRoadmaps.reduce((sum, roadmap) => sum + (roadmap.views || 0), 0);

    setStats({
      totalViews: projectTotal,
      totalVideoViews: videoTotal,
      totalRoadmapViews: roadmapTotal
    });

  }, [projects, videos, roadMaps, timeFilter, periodType, customRange]);

  const generateChartData = (data, label, color) => ({
    labels: data?.map(item => item.title) || [],
    datasets: [
      {
        label,
        data: data?.map(item => item.views || 0) || [],
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 1,
        barThickness: 'flex'
      }
    ]
  });

  const projectChartData = generateChartData(
    filterDataByTime(projects),
    'Project Views',
    { bg: 'rgba(255, 99, 132, 0.5)', border: 'rgb(255, 99, 132)' }
  );

  const videoChartData = generateChartData(
    filterDataByTime(videos?.data),
    'Video Views', 
    { bg: 'rgba(75, 192, 192, 0.5)', border: 'rgb(75, 192, 192)' }
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Views Distribution (${periodType === 'fixed' ? 'Custom Range' : timeFilter})`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString()
        }
      }
    }
  };

  if (projectsLoading || videosLoading || roadmapsLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="loading loading-spinner loading-lg"></div>
    </div>;
  }

  const statsCards = [
    {
      title: "Project Views",
      value: stats.totalViews,
      icon: Eye,
      color: "primary"
    },
    {
      title: "Video Views",
      value: stats.totalVideoViews,
      icon: VideoIcon,
      color: "secondary"
    },
    {
      title: "Roadmap Views",
      value: stats.totalRoadmapViews,
      icon: Map,
      color: "accent"
    }
  ];

  return (
    <div className=" py-20 mb-4 px-4 min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="card bg-base-100 border border-primary/10">
          <div className="card-body">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
              
              <div className="tabs tabs-boxed">
                <a 
                  className={`tab gap-2 ${periodType === 'fixed' ? 'tab-active' : ''}`}
                  onClick={() => setPeriodType('fixed')}
                >
                  <Calendar className="w-4 h-4" />
                  Fixed Period
                </a>
                <a 
                  className={`tab gap-2 ${periodType === 'relative' ? 'tab-active' : ''}`}
                  onClick={() => setPeriodType('relative')}
                >
                  <Clock className="w-4 h-4" />
                  Relative
                </a>
              </div>
            </div>

            <div className="divider"></div>

            <div className="flex justify-end">
              {periodType === 'fixed' ? (
                <div className="join bg-base-200 rounded-lg border border-primary/10 p-2">
                  <div className="join-item flex flex-col">
                    <span className="text-xs text-base-content/70 mb-1">Start Date</span>
                    <input
                      type="date"
                      className="input input-sm input-ghost w-full focus:outline-none"
                      value={customRange.start}
                      onChange={(e) => setCustomRange(prev => ({...prev, start: e.target.value}))}
                    />
                  </div>
                  <div className="divider divider-horizontal "></div>
                  <div className="join-item flex flex-col  ">
                    <span className="text-xs text-base-content/70 mb-1">End Date</span>
                    <input
                      type="date"
                      className="input input-sm input-ghost w-full focus:outline-none"
                      value={customRange.end}
                      onChange={(e) => setCustomRange(prev => ({...prev, end: e.target.value}))}
                    />
                  </div>
                </div>
              ) : (
                <select 
                  className="select select-bordered select-primary w-full max-w-xs focus:outline-none"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                >
                  <option value="day">Last 24 Hours</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats stats-vertical lg:stats-horizontal bg-base-200 border border-primary/10">
          {statsCards.map((stat, index) => (
            <div className="stat" key={index}>
              <div className={`stat-figure text-${stat.color}`}>
                <div >
                  <div className={`bg-${stat.color} text-${stat.color}-content rounded-full w-16 h-16 flex items-center justify-center`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                </div>
              </div>
              <div className="stat-title">{stat.title}</div>
              <div className={`stat-value text-${stat.color}`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="stat-desc">During selected period</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { title: 'Project Views', icon: Eye, data: projectChartData },
            { title: 'Video Views', icon: VideoIcon, data: videoChartData }
          ].map((chart, index) => (
            <div key={index} className="card bg-base-200 border border-primary/10">
              <div className="card-body">
                <h3 className="card-title text-2xl font-bold flex items-center gap-2">
                  <chart.icon className="w-6 h-6" />
                  {chart.title}
                </h3>
                <div className=" h-[400px]">
                  <Bar data={chart.data} options={chartOptions} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
