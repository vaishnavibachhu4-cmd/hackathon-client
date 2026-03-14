import React, { useState } from 'react';
import { Search, Eye, Download, ExternalLink, Github, Play } from 'lucide-react';
import { db } from '../../lib/db';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import type { Project } from '../../lib/types';

const categoryColors: Record<string, 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'orange'> = {
  'AI/ML': 'purple', 'Web Development': 'blue', 'Mobile App': 'green',
  'IoT': 'yellow', 'Cybersecurity': 'red', 'Blockchain': 'orange',
};

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects = db.getProjects()
    .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
    .filter(p =>
      p.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.teamName.toLowerCase().includes(search.toLowerCase()) ||
      p.leaderName.toLowerCase().includes(search.toLowerCase())
    );

  const categories = ['AI/ML', 'Web Development', 'Mobile App', 'IoT', 'Cybersecurity', 'Blockchain'];

  const handleDownload = (project: Project) => {
    if (project.projectFileData) {
      const link = document.createElement('a');
      link.href = project.projectFileData;
      link.download = project.projectFileName || 'project-file';
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <p className="text-gray-400 text-sm mt-1">All submitted projects with details and files</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search projects, teams..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-800">
              {['Team Name', 'Project Title', 'Category', 'Leader', 'Submitted', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {projects.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No projects found</td></tr>
            ) : projects.map(p => (
              <tr key={p.id} className="bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3 text-sm text-white font-medium">{p.teamName}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{p.projectTitle}</td>
                <td className="px-4 py-3">
                  <Badge variant={categoryColors[p.category] || 'blue'}>{p.category}</Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{p.leaderName}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{new Date(p.submissionDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedProject(p)}
                      className="p-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-900/30 rounded-lg transition-colors" title="View">
                      <Eye size={15} />
                    </button>
                    {p.projectFileData && (
                      <button onClick={() => handleDownload(p)}
                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-lg transition-colors" title="Download">
                        <Download size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title="Project Details" size="lg">
        {selectedProject && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white text-xl font-bold">{selectedProject.projectTitle}</h3>
                <p className="text-gray-400">{selectedProject.teamName} · {selectedProject.leaderName}</p>
              </div>
              <Badge variant={categoryColors[selectedProject.category] || 'blue'}>{selectedProject.category}</Badge>
            </div>

            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Description</p>
              <p className="text-gray-300 text-sm leading-relaxed bg-gray-800 rounded-lg p-4">{selectedProject.description}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Technology Stack</p>
              <p className="text-gray-300 text-sm bg-gray-800 rounded-lg p-3">{selectedProject.techStack}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {selectedProject.githubLink && (
                <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                  <Github size={16} /> GitHub Repository
                </a>
              )}
              {selectedProject.demoVideo && (
                <a href={selectedProject.demoVideo} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                  <Play size={16} /> Project Video Link
                </a>
              )}
              {selectedProject.projectFileData && (
                <button onClick={() => handleDownload(selectedProject!)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 rounded-lg text-sm transition-colors">
                  <Download size={16} /> Download Video ({selectedProject.projectFileName})
                </button>
              )}
            </div>

            <div className="text-xs text-gray-500">
              Submitted: {new Date(selectedProject.submissionDate).toLocaleString()}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
