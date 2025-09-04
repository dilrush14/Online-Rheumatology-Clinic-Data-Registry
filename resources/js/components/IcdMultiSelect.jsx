import React, { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";

export default function IcdMultiSelect({
  value,
  onChange,
  placeholder = "Search ICD‑11…",
  category, // "complaint" | "diagnosis"
}) {
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState("");
  const ctrl = useRef(null);

  // fetch options whenever the user types
  useEffect(() => {
    const id = setTimeout(async () => {
      try {
        if (ctrl.current) ctrl.current.abort();
        ctrl.current = new AbortController();

        const url =
          `/doctor/icd-terms?category=${encodeURIComponent(category)}&search=${encodeURIComponent(input)}&limit=30`;

        const res = await fetch(url, { signal: ctrl.current.signal });
        if (!res.ok) throw new Error("ICD fetch failed");
        const data = await res.json(); // [{code,title,label,value,category}]
        setOptions(data);
      } catch (e) {
        // silent fail is fine for UX
        setOptions([]);
      }
    }, 250);
    return () => clearTimeout(id);
  }, [input, category]);

  const selected = useMemo(() => {
    // value is an array like [{code,title}] → map to react-select shape
    return (value || []).map((v) => ({
      value: v.code,
      label: `${v.code} — ${v.title}`,
      code: v.code,
      title: v.title,
    }));
  }, [value]);

  const handleChange = (items) => {
    const arr = (items || []).map((it) => ({
      code: it.code || it.value,
      title: it.title || it.label?.split(" — ")?.[1] || "",
    }));
    onChange(arr);
  };

  return (
    <Select
      isMulti
      classNamePrefix="react-select"
      placeholder={placeholder}
      options={options}
      value={selected}
      onChange={handleChange}
      onInputChange={setInput}
      noOptionsMessage={() => (input ? "No matches" : "Start typing…")}
      styles={{
        menu: (base) => ({ ...base, zIndex: 50 }),
      }}
    />
  );
}
