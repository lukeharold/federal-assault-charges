import React, { useState, useEffect } from 'react';
import cases from "./data/cases.json";
import { Calendar, MapPin, FileText, Scale, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

// Groups one date's header and cards.
const Reveal = ({ children }) => <div className="reveal-group">{children}</div>;

// Fades case cards in and out as they move through the screen, and fades each date
// in as it arrives. Dates then stay pinned at the top (see index.css) until the next
// date pushes them away. Scrolling up reverses everything.
const FADE_ZONE = 0.22; // share of the screen height where fading happens
const DRIFT_PX = 40; // how far items move while fading
const useScrollFade = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = null;
    const setFade = (el, v, direction) => {
      el.style.opacity = v.toFixed(3);
      el.style.transform = v >= 1 ? '' : `translateY(${((1 - v) * DRIFT_PX * direction).toFixed(1)}px)`;
    };
    const update = () => {
      frame = null;
      const h = window.innerHeight;
      const zone = h * FADE_ZONE;
      // Cards fade out as they slide under the pinned date, not at the very top.
      const pinned = document.querySelector('.reveal-group > :first-child');
      const top = pinned ? pinned.offsetHeight : 0;
      document.querySelectorAll('.reveal-group > :first-child').forEach((el) => {
        const r = el.getBoundingClientRect();
        setFade(el, Math.min(1, Math.max(0, (h - r.top) / zone)), 1);
      });
      document.querySelectorAll('.reveal-group .grid > *').forEach((el) => {
        const r = el.getBoundingClientRect();
        const enter = Math.min(1, Math.max(0, (h - r.top) / zone));
        const exit = Math.min(1, Math.max(0, (r.bottom - top) / zone));
        setFade(el, Math.min(enter, exit), enter < exit ? 1 : -1);
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }); // runs after every render, so filtered and expanded cards stay in sync
};

const CourtCaseTimeline = () => {
  useScrollFade();
  const [expandedCases, setExpandedCases] = useState(new Set());
  const [selectedStatus, setSelectedStatus] = useState('all');

  const toggleCase = (id) => {
    const newExpanded = new Set(expandedCases);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCases(newExpanded);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'n/a') return 'Date unknown';
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getOutcomeColor = (outcome) => {
    const o = outcome.toLowerCase();
    if (o === 'guilty') return 'bg-red-100 text-red-800';
    if (o === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (o === 'dismissed') return 'bg-green-100 text-green-800';
    if (o === 'not guilty') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const statusConfig = [
    { key: 'Pending',    label: 'Pending',    color: 'bg-yellow-400', text: 'text-yellow-900' },
    { key: 'Guilty',     label: 'Guilty',     color: 'bg-red-500',    text: 'text-white'      },
    { key: 'Dismissed',  label: 'Dismissed',  color: 'bg-green-500',  text: 'text-white'      },
    { key: 'Not guilty', label: 'Not Guilty', color: 'bg-blue-500',   text: 'text-white'      },
  ];

  const statusCounts = statusConfig.map(s => ({
    ...s,
    count: cases.filter(c => c.outcome.toLowerCase() === s.key.toLowerCase()).length,
  }));
  const total = cases.length;

  const filteredCases = selectedStatus === 'all'
    ? cases
    : cases.filter(c => c.outcome.toLowerCase() === selectedStatus.toLowerCase());

  const casesByDate = filteredCases.reduce((acc, c) => {
    const key = c.date && c.date !== 'n/a' ? c.date : 'n/a';
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  const sortedDates = Object.keys(casesByDate).sort((a, b) => {
    if (a === 'n/a') return 1;
    if (b === 'n/a') return -1;
    return new Date(a) - new Date(b);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            A timeline of alleged assaults committed against federal agents in California since the immigration raids started
          </h1>
          <p className="text-slate-600 mb-1">Data compiled by Luke Harold. Coding by Claude.ai.</p>
          <p className="text-slate-500 text-sm mb-4">Last manual update: Oct. 6, 2026</p>

          {/* About */}
          <div className="p-5 bg-white rounded-lg shadow-md border border-slate-200 mb-4">
            <h3 className="font-semibold text-slate-800 mb-2">About this visualization</h3>
            <p className="text-slate-600 text-sm">
              This timeline displays {cases.length} federal court cases involving charges of assaulting or impeding federal officers in California, grouped by incident date. Cases were located using PACER and by contacting the courts directly; it's possible there are others not listed here. Use PACER or CourtListener for the most up-to-date information about any given case. Use the filter below to view cases by status. Click "View Details" on any card to see the court, plea, and links to source documents.
            </p>
          </div>

          {/* Merged clickable status bar */}
          <div className="bg-white rounded-lg shadow-md p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Case Status — click to filter</h2>
              {selectedStatus !== 'all' && (
                <button
                  onClick={() => setSelectedStatus('all')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  Show all
                </button>
              )}
            </div>
            <div className="flex rounded-lg overflow-hidden h-8 mb-3 cursor-pointer">
              {statusCounts.map(s => (
                <div
                  key={s.key}
                  onClick={() => setSelectedStatus(selectedStatus === s.key ? 'all' : s.key)}
                  className={`${s.color} flex items-center justify-center transition-all hover:opacity-80 ${
                    selectedStatus !== 'all' && selectedStatus !== s.key ? 'opacity-30' : ''
                  }`}
                  style={{ width: `${(s.count / total) * 100}%`, minWidth: s.count > 0 ? '2rem' : '0' }}
                  title={`Click to filter: ${s.label} (${s.count})`}
                >
                  {s.count > 0 && (
                    <span className={`text-xs font-bold ${s.text} whitespace-nowrap px-1`}>
                      {s.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {statusCounts.map(s => (
                <button
                  key={s.key}
                  onClick={() => setSelectedStatus(selectedStatus === s.key ? 'all' : s.key)}
                  className={`flex items-center gap-1.5 text-sm rounded-md px-2 py-1 transition-colors ${
                    selectedStatus === s.key
                      ? 'bg-slate-200 font-semibold text-slate-900'
                      : selectedStatus !== 'all'
                      ? 'text-slate-400 hover:text-slate-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className={`inline-block w-3 h-3 rounded-sm ${s.color}`}></span>
                  <span>{s.label}: <strong>{s.count}</strong> ({Math.round((s.count / total) * 100)}%)</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {sortedDates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-slate-200">
            <p className="text-slate-600">No cases match the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedDates.map((date) => (
              <Reveal key={date}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold text-lg">{formatDate(date)}</span>
                  </div>
                  <div className="text-sm text-slate-600 font-medium">
                    {casesByDate[date].length} {casesByDate[date].length === 1 ? 'case' : 'cases'}
                  </div>
                  <div className="h-0.5 flex-grow bg-slate-300"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  {casesByDate[date].map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all border border-slate-200 overflow-hidden flex flex-col"
                    >
                      <div className="p-5 flex-grow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-grow pr-2">
                            <h3 className="text-base font-bold text-slate-800 leading-tight mb-1">
                              {caseItem.defendant}
                            </h3>
                            <p className="text-sm text-slate-600 leading-tight mb-1">
                              {caseItem.charge !== 'n/a' ? caseItem.charge : 'Charge not listed'}
                            </p>
                            {caseItem.chargeType && caseItem.chargeType !== 'n/a' && (
                              <span className="text-xs text-slate-500 font-medium">
                                {caseItem.chargeType}
                              </span>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getOutcomeColor(caseItem.outcome)}`}>
                            {caseItem.outcome}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 mb-4">
                          {caseItem.description !== 'n/a' && (
                            <div className="flex items-start gap-2">
                              <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span className="text-sm leading-relaxed">{caseItem.description}</span>
                            </div>
                          )}
                          {caseItem.location !== 'n/a' && (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span className="text-xs">{caseItem.location}</span>
                            </div>
                          )}
                        </div>

                        {expandedCases.has(caseItem.id) && (
                          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                            {caseItem.court && caseItem.court !== 'n/a' && (
                              <div>
                                <h4 className="font-semibold text-slate-700 mb-1 text-sm flex items-center gap-1">
                                  <Scale className="w-4 h-4" />
                                  Court
                                </h4>
                                <p className="text-slate-600 text-sm">{caseItem.court}</p>
                              </div>
                            )}
                            {caseItem.details && caseItem.details !== 'n/a' && (
                              <div>
                                <h4 className="font-semibold text-slate-700 mb-1 text-sm">Case Details</h4>
                                <p className="text-slate-600 text-sm">{caseItem.details}</p>
                              </div>
                            )}
                            {caseItem.latestFiling && (
                              <div>
                                <h4 className="font-semibold text-slate-700 mb-1 text-sm">Latest filing on CourtListener</h4>
                                <p className="text-slate-500 text-xs mb-1">
                                  Filed {formatDate(caseItem.latestFiling.date)}
                                  {caseItem.latestFiling.checked && <> · checked {formatDate(caseItem.latestFiling.checked)}</>}
                                </p>
                                <p className="text-slate-600 text-sm">{caseItem.latestFiling.text}</p>
                                <a
                                  href={caseItem.latestFiling.docketUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  View docket on CourtListener
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => toggleCase(caseItem.id)}
                        className="w-full bg-slate-50 hover:bg-slate-100 transition-colors py-2 px-5 flex items-center justify-center gap-2 text-slate-700 text-sm font-medium border-t border-slate-200"
                      >
                        {expandedCases.has(caseItem.id) ? (
                          <>
                            <span>Show Less</span>
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>View Details</span>
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        )}


      </div>
    </div>
  );
};

export default CourtCaseTimeline;