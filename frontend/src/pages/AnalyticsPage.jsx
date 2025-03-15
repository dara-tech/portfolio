import React, { useEffect, useState } from 'react';
import useProjects from '../hooks/useProjects';
import useVideo from '../hooks/useVideo';
import { useRoadMapByID } from '../hooks/useRoadMap';
import { Eye, Video as VideoIcon, Map, Calendar, Clock, BarChart2, PieChart, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  PointElement,
  LineElement,
  Filler
);

const AnalyticsPage = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { videos, getAllVideos, loading: videosLoading } = useVideo();
  const { roadMaps, loading: roadmapsLoading } = useRoadMapByID();
  const [timeFilter, setTimeFilter] = useState('month');
  const [periodType, setPeriodType] = useState('fixed');
  const [chartType, setChartType] = useState('bar');
  const [viewByContent, setViewByContent] = useState('all'); // New state for content filter
  const [customRange, setCustomRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [stats, setStats] = useState({
    totalViews: 0,
    totalVideoViews: 0,
    totalRoadmapViews: 0,
    viewsGrowth: 0,
    videoViewsGrowth: 0,
    roadmapViewsGrowth: 0,
    contentViews: [] // New stat for content-specific views
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

    // Group data by date and calculate daily totals
    const dailyData = data.reduce((acc, item) => {
      const date = format(new Date(item[dateField]), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = {
          date,
          views: 0,
          items: []
        };
      }
      acc[date].views += (item.views || 0);
      acc[date].items.push(item);
      return acc;
    }, {});

    return Object.values(dailyData).filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  useEffect(() => {
    if (!projects || !videos?.data || !roadMaps) return;

    const filteredProjects = filterDataByTime(projects);
    const filteredVideos = filterDataByTime(videos.data);
    const filteredRoadmaps = filterDataByTime(roadMaps);

    const calculateTotal = (data) => data.reduce((sum, day) => sum + day.views, 0);
    const calculateGrowth = (data) => {
      if (data.length < 2) return 0;
      const oldValue = data[0].views;
      const newValue = data[data.length - 1].views;
      return oldValue === 0 ? 100 : ((newValue - oldValue) / oldValue) * 100;
    };

    // Calculate content-specific views
    let contentViews = [];
    if (viewByContent !== 'all') {
      const selectedData = viewByContent === 'projects' ? projects :
                         viewByContent === 'videos' ? videos?.data :
                         roadMaps;
      
      contentViews = selectedData?.map(item => ({
        title: item.title,
        views: item.views || 0
      })).sort((a, b) => b.views - a.views).slice(0, 5);
    }

    setStats({
      totalViews: calculateTotal(filteredProjects),
      totalVideoViews: calculateTotal(filteredVideos),
      totalRoadmapViews: calculateTotal(filteredRoadmaps),
      viewsGrowth: calculateGrowth(filteredProjects),
      videoViewsGrowth: calculateGrowth(filteredVideos),
      roadmapViewsGrowth: calculateGrowth(filteredRoadmaps),
      contentViews
    });

  }, [projects, videos, roadMaps, timeFilter, periodType, customRange, viewByContent]);

  const truncateTitle = (title) => {
    return title?.length > 20 ? title.substring(0, 20) + '...' : title;
  };

  const generateChartData = (data, label, color) => {
    if (!data) return null;

    const commonDataset = {
      label,
      data: data.map(day => day.views),
      borderWidth: 2,
      tension: 0.4
    };

    switch (chartType) {
      case 'doughnut':
        return {
          labels: data.map(day => format(new Date(day.date), 'MMM dd')),
          datasets: [{
            ...commonDataset,
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
            ]
          }]
        };
      
      case 'line':
        return {
          labels: data.map(day => format(new Date(day.date), 'MMM dd')),
          datasets: [{
            ...commonDataset,
            fill: true,
            backgroundColor: color.bg,
            borderColor: color.border,
            pointBackgroundColor: color.border,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: color.border
          }]
        };
      
      default: // bar
        return {
          labels: data.map(day => format(new Date(day.date), 'MMM dd')),
          datasets: [{
            ...commonDataset,
            backgroundColor: color.bg,
            borderColor: color.border,
            borderRadius: 8,
            barThickness: 20
          }]
        };
    }
  };

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
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: { size: 12 },
          boxWidth: 15,
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: `Views Distribution (${periodType === 'fixed' ? 'Custom Range' : timeFilter})`,
        font: {
          size: 14,
          weight: 'bold'
        },
        padding: 15
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        titleFont: { size: 12 },
        bodyFont: { size: 11 },
        displayColors: true,
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `Views: ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    scales: chartType !== 'doughnut' ? {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(200, 200, 200, 0.2)'
        },
        ticks: {
          callback: (value) => value.toLocaleString(),
          font: { size: 11 }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 45
        }
      }
    } : {}
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
      growth: stats.viewsGrowth,
      icon: Eye,
      color: "primary"
    },
    {
      title: "Video Views",
      value: stats.totalVideoViews,
      growth: stats.videoViewsGrowth,
      icon: VideoIcon,
      color: "secondary"
    },
    {
      title: "Roadmap Views",
      value: stats.totalRoadmapViews,
      growth: stats.roadmapViewsGrowth,
      icon: Map,
      color: "accent"
    }
  ];

  return (
    <div className="py-20 mb-4 px-4 min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="card bg-base-100 border border-primary/10">
          <div className="card-body">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
              
              <div className="flex gap-4">
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

                <div className="tabs tabs-boxed">
                  <a 
                    className={`tab gap-2 ${chartType === 'bar' ? 'tab-active' : ''}`}
                    onClick={() => setChartType('bar')}
                  >
                    <BarChart2 className="w-4 h-4" />
                    Bar
                  </a>
                  <a 
                    className={`tab gap-2 ${chartType === 'line' ? 'tab-active' : ''}`}
                    onClick={() => setChartType('line')}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Line
                  </a>
                  <a 
                    className={`tab gap-2 ${chartType === 'doughnut' ? 'tab-active' : ''}`}
                    onClick={() => setChartType('doughnut')}
                  >
                    <PieChart className="w-4 h-4" />
                    Doughnut
                  </a>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="flex justify-between items-center">
              <div className="tabs tabs-boxed">
                <a 
                  className={`tab gap-2 ${viewByContent === 'all' ? 'tab-active' : ''}`}
                  onClick={() => setViewByContent('all')}
                >
                  <Eye className="w-4 h-4" />
                  All Content
                </a>
                <a 
                  className={`tab gap-2 ${viewByContent === 'projects' ? 'tab-active' : ''}`}
                  onClick={() => setViewByContent('projects')}
                >
                  <FileText className="w-4 h-4" />
                  Projects
                </a>
                <a 
                  className={`tab gap-2 ${viewByContent === 'videos' ? 'tab-active' : ''}`}
                  onClick={() => setViewByContent('videos')}
                >
                  <VideoIcon className="w-4 h-4" />
                  Videos
                </a>
                <a 
                  className={`tab gap-2 ${viewByContent === 'roadmaps' ? 'tab-active' : ''}`}
                  onClick={() => setViewByContent('roadmaps')}
                >
                  <Map className="w-4 h-4" />
                  Roadmaps
                </a>
              </div>

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
                    <div className="divider divider-horizontal"></div>
                    <div className="join-item flex flex-col">
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
        </div>

        {/* Stats Cards */}
        <div className="stats stats-vertical lg:stats-horizontal bg-base-200 border border-primary/10">
          {statsCards.map((stat, index) => (
            <div className="stat" key={index}>
              <div className={`stat-figure text-${stat.color}`}>
                <div>
                  <div className={`bg-${stat.color} text-${stat.color}-content rounded-full w-16 h-16 flex items-center justify-center`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                </div>
              </div>
              <div className="stat-title">{stat.title}</div>
              <div className={`stat-value text-${stat.color}`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="stat-desc flex items-center gap-1">
                {stat.growth > 0 ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-error" />
                )}
                {Math.abs(stat.growth).toFixed(1)}% from previous period
              </div>
            </div>
          ))}
        </div>

        {/* Content-specific views */}
        {viewByContent !== 'all' && stats.contentViews.length > 0 && (
          <div className="card bg-base-200 border border-primary/10">
            <div className="card-body">
              <h3 className="card-title text-2xl font-bold">Top {viewByContent}</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.contentViews.map((item, index) => (
                      <tr key={index}>
                        <td>{truncateTitle(item.title)}</td>
                        <td>{item.views.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

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
                <div className="h-[400px]">
                  {chartType === 'bar' ? (
                    <Bar data={chart.data} options={chartOptions} />
                  ) : chartType === 'line' ? (
                    <Line data={chart.data} options={chartOptions} />
                  ) : (
                    <Doughnut data={chart.data} options={chartOptions} />
                  )}
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
