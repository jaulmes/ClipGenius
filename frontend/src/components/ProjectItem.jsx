// src/components/ProjectItem.jsx
import React, { useEffect, useState } from 'react';
import Card from './ui/Card';
import ProgressBar from './ui/ProgressBar';

const ProjectItem = ({ project }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (project.status === 'Processing') {
      // Simulate a smooth progress bar animation
      const interval = setInterval(() => {
        setProgress(oldProgress => {
          if (oldProgress >= 95) {
            clearInterval(interval);
            return 95; // Stop just before 100 to wait for the final result
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 95);
        });
      }, 300);
      return () => clearInterval(interval);
    } else if (project.status === 'Completed') {
      setProgress(100);
    }
  }, [project.status]);

  return (
    <Card className="flex items-center space-x-4">
      <img 
        src={project.thumbnailUrl || 'https://placehold.co/120x90/1a202c/ffffff?text=Processing'} 
        alt={project.title}
        className="w-32 h-20 object-cover rounded-md"
      />
      <div className="flex-grow">
        <h3 className="font-bold text-lg truncate">{project.title}</h3>
        <p className="text-sm text-gray-400">{project.status}</p>
        {project.status === 'Processing' && (
          <div className="mt-2">
            <ProgressBar progress={progress} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProjectItem;
