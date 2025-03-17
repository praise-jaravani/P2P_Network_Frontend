'use client';

import React from 'react';
import { useAppContext } from '../../context/app-context';
import DownloadProgress from './download-progress';
import { DownloadProgress as DownloadProgressType } from '../../types';

export default function DownloadList() {
  const { systemStatus, isLoading, downloadToClient } = useAppContext();
  
  const currentDownloads = systemStatus?.downloads?.current_downloads || [];
  const completedDownloads = systemStatus?.downloads?.completed_downloads || [];
  
  // Convert completed downloads to the same format for display
  const completedDownloadObjects: DownloadProgressType[] = completedDownloads.map(filename => ({
    filename,
    progress: '100/100 chunks (100.0%)',
    seeders: 0, // We don't know how many seeders there were
    status: 'completed'
  }));

  // If loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  // If no downloads
  if (currentDownloads.length === 0 && completedDownloads.length === 0) {
    return (
      <div className="py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No downloads</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          You haven't downloaded any files yet.
        </p>
        <div className="mt-6">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => window.location.href = '/dashboard/files'}
          >
            Find files to download
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Downloads Section */}
      {currentDownloads.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Active Downloads</h2>
          <div className="space-y-4">
            {currentDownloads.map((download) => (
              <DownloadProgress
                key={download.filename}
                download={{
                  ...download,
                  status: 'downloading'
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Completed Downloads Section */}
      {completedDownloads.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 mt-8">Completed Downloads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedDownloadObjects.map((download) => (
              <div
                key={download.filename}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 p-2 rounded-full">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={download.filename}>
                      {download.filename}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Downloaded and seeding
                    </p>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={() => downloadToClient(download.filename)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V16M12 16L8 12M12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Download to Browser
                  </button>
                  <button
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}