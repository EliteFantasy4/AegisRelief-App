import React, { useState } from 'react';
import { EMERGENCY_DIRECTORIES } from '../../data/mockDirectory';
import { CountryHelplines } from '../../types/disaster';
import {
  PhoneCall,
  Search,
  Copy,
  Check,
  Shield,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface EmergencyDirectoryProps {
  initialCountry?: string;
}

export const EmergencyDirectory: React.FC<EmergencyDirectoryProps> = ({ initialCountry }) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    initialCountry
      ? EMERGENCY_DIRECTORIES.find(
          (c) => c.countryName.toLowerCase().includes(initialCountry.toLowerCase())
        )?.countryCode || 'NP'
      : 'NP'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const selectedCountry =
    EMERGENCY_DIRECTORIES.find((c) => c.countryCode === selectedCountryCode) ||
    EMERGENCY_DIRECTORIES[0];

  const nepalDirectory = EMERGENCY_DIRECTORIES.find((c) => c.countryCode === 'NP')!;

  const handleCopy = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const filteredContacts = selectedCountry.contacts.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.label.toLowerCase().includes(q) ||
      c.number.toLowerCase().includes(q) ||
      c.service.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Featured Header & Country Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-500" />
              National Emergency Hotlines &amp; First-Responder Directory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified 24/7 disaster management authorities, police, ambulance, and swift rescue command centers
            </p>
          </div>

          {/* Country Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="countrySelect" className="text-xs font-medium text-slate-500 shrink-0">
              Country:
            </label>
            <select
              id="countrySelect"
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {EMERGENCY_DIRECTORIES.map((c) => (
                <option key={c.countryCode} value={c.countryCode}>
                  {c.flagEmoji} {c.countryName} ({c.primaryEmergency})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Contacts in this Country */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${selectedCountry.countryName} emergency services (e.g. Police, Ambulance, Flood, NDRRMA)...`}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* DEDICATED QUICK-ACCESS SECTION FOR NEPAL (Mandatory Feature [E]) */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Background Subtle Watermark */}
        <div className="absolute right-4 bottom-2 text-8xl font-black text-white/5 select-none pointer-events-none">
          नेपाल
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl leading-none">🇳🇵</span>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Nepal Quick-Access Disaster &amp; Emergency Hub (नेपाल आपत्कालीन सेवाहरू)
                </h3>
                <p className="text-xs text-rose-100">
                  National Disaster Risk Reduction &amp; Management Authority (NDRRMA) &amp; Security Services
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-black/30 font-bold uppercase tracking-wider text-rose-100 shrink-0">
              Direct National Toll-Free
            </span>
          </div>

          {/* Quick Dials Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              { label: 'Nepal Police', num: '100', neLabel: 'प्रहरी' },
              { label: 'Ambulance', num: '102', neLabel: 'एम्बुलेन्स' },
              { label: 'Fire Service', num: '101', neLabel: 'दमकल' },
              { label: 'Highway & Traffic', num: '1149', neLabel: 'ट्राफिक/पहिरो' },
              { label: 'NDRRMA Disaster', num: '1155', neLabel: 'विपद् हेल्पलाइन' },
              { label: 'Armed Police Force', num: '1114', neLabel: 'सशस्त्र प्रहरी' },
            ].map((contact, idx) => (
              <div
                key={idx}
                className="bg-black/25 hover:bg-black/35 backdrop-blur-sm rounded-xl p-3 border border-white/15 flex flex-col justify-between transition-colors"
              >
                <div>
                  <span className="text-[10px] text-rose-200 uppercase font-mono block">
                    {contact.neLabel}
                  </span>
                  <strong className="text-xs font-semibold text-white block truncate">
                    {contact.label}
                  </strong>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <a
                    href={`tel:${contact.num}`}
                    className="text-lg font-extrabold font-mono text-white hover:text-amber-200 transition-colors"
                  >
                    {contact.num}
                  </a>
                  <button
                    onClick={() => handleCopy(contact.num)}
                    className="p-1 rounded text-rose-200 hover:text-white hover:bg-white/20 transition-colors"
                    title="Copy Number"
                  >
                    {copiedNumber === contact.num ? (
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-rose-100 flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[11px]">
            <span>Official Portal: <strong>bipadportal.gov.np</strong></span>
            <span>Central Operations Desk: <strong>+977-1-4200105</strong></span>
          </div>
        </div>
      </div>

      {/* Selected Country Emergency Details */}
      <div className="space-y-4">
        {/* Country Title and Lead Authority Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedCountry.flagEmoji}</span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedCountry.countryName} - Disaster Management Architecture
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Region: {selectedCountry.region} · Primary Universal Emergency:{' '}
                  <strong className="text-red-600 dark:text-red-400">
                    {selectedCountry.primaryEmergency}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* National Authority Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-sky-600 dark:text-sky-400 font-bold block">
                STATUTORY NATIONAL LEAD AGENCY
              </span>
              <strong className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedCountry.disasterAuthority.name}
              </strong>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                {selectedCountry.disasterAuthority.description}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${selectedCountry.disasterAuthority.phone}`}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-mono font-bold transition-colors flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{selectedCountry.disasterAuthority.phone}</span>
              </a>
              {selectedCountry.disasterAuthority.websiteUrl && (
                <a
                  href={selectedCountry.disasterAuthority.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Official Website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Contact List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContacts.map((contact, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">
                    {contact.service}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {contact.label}
                  </h4>
                </div>

                <div className="flex items-center gap-1">
                  {contact.tollFree && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                      Toll-Free
                    </span>
                  )}
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {contact.availableHours}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {contact.description}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <a
                  href={`tel:${contact.number}`}
                  className="text-base font-extrabold font-mono text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1.5"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{contact.number}</span>
                </a>

                <button
                  onClick={() => handleCopy(contact.number)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1"
                >
                  {copiedNumber === contact.number ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* "What to Say to 911 / 100 Dispatchers" Emergency Protocol Card */}
      <div className="bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/50 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-sky-900 dark:text-sky-200 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-sky-500" />
          4-Step Emergency Call Triage Protocol (What to tell the dispatcher)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-sky-100 dark:border-sky-900/50">
            <strong className="text-sky-600 font-mono block">1. EXACT LOCATION</strong>
            <span className="text-slate-600 dark:text-slate-300 mt-1 block">
              Give address, cross streets, landmarks, floor/room number, or GPS pin.
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-sky-100 dark:border-sky-900/50">
            <strong className="text-sky-600 font-mono block">2. NATURE OF CRISIS</strong>
            <span className="text-slate-600 dark:text-slate-300 mt-1 block">
              State if building collapsed, active flooding, toxic vapor, or trapped casualties.
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-sky-100 dark:border-sky-900/50">
            <strong className="text-sky-600 font-mono block">3. CASUALTIES</strong>
            <span className="text-slate-600 dark:text-slate-300 mt-1 block">
              Number of injured, conscious or unconscious, severe bleeding, or trapped minors.
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-sky-100 dark:border-sky-900/50">
            <strong className="text-sky-600 font-mono block">4. REMAIN ON LINE</strong>
            <span className="text-slate-600 dark:text-slate-300 mt-1 block">
              Never hang up first; answer dispatcher triage questions calmly until first responders arrive.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
