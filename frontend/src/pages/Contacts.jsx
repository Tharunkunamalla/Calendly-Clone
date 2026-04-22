import React, {useEffect, useMemo, useState} from "react";
import {format} from "date-fns";
import {Search, Eye, Filter, Plus, MoreVertical} from "lucide-react";
import {contactsApi} from "../utils/api";
import {toast} from "react-toastify";

const formatDateCell = (value) => {
  if (!value) return "";
  return format(new Date(value), "M/d/yyyy");
};

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const {data} = await contactsApi.getAll();
        setContacts(data);
      } catch (error) {
        const message =
          error?.response?.data?.error ||
          "Could not load contacts. Please try again.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return contacts;

    return contacts.filter((contact) => {
      return [contact.name, contact.email, contact.phoneNumber, contact.company]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [contacts, search]);

  return (
    <div className="animate-fade-in" style={{background: "#fff", minHeight: "100%"}}>
      <header
        style={{
          minHeight: "72px",
          borderBottom: "1px solid #d7e1ee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "1.2rem",
          marginBottom: "1.6rem",
        }}
      >
        <h1 style={{fontSize: "2rem", fontWeight: 800, color: "#0f2d4d", margin: 0}}>
          Contacts
        </h1>
        <button
          type="button"
          style={{
            border: "none",
            background: "#0f65e8",
            color: "#fff",
            borderRadius: "999px",
            padding: "0.82rem 1.35rem",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
          }}
        >
          <Plus size={18} /> Add contact
        </button>
      </header>

      <div style={{display: "flex", gap: "0.75rem", marginBottom: "1.3rem"}}>
        <div
          style={{
            width: "360px",
            border: "1px solid #bfd1e8",
            borderRadius: "10px",
            background: "#fff",
            padding: "0.62rem 0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <Search size={19} color="#587698" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name and email"
            style={{border: "none", outline: "none", width: "100%", color: "#334155"}}
          />
        </div>

        <button
          type="button"
          style={{
            border: "1px solid #bfd1e8",
            background: "#fff",
            color: "#1f3652",
            borderRadius: "10px",
            padding: "0 1.05rem",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Eye size={18} /> Show columns
        </button>

        <button
          type="button"
          style={{
            border: "1px solid #bfd1e8",
            background: "#fff",
            color: "#1f3652",
            borderRadius: "10px",
            padding: "0 1.05rem",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Filter size={18} /> Filter
        </button>
      </div>

      <div style={{border: "1px solid #c8d7ea", borderRadius: "8px", overflow: "hidden"}}>
        <table style={{width: "100%", borderCollapse: "collapse", background: "#fff"}}>
          <thead>
            <tr style={{background: "#f8fbff"}}>
              {[
                "Name",
                "Email",
                "Phone number",
                "Last meeting date",
                "Next meeting date",
                "Company",
              ].map((heading) => (
                <th
                  key={heading}
                  style={{
                    textAlign: "left",
                    padding: "0.8rem 0.85rem",
                    color: "#0f2d4d",
                    borderBottom: "1px solid #c8d7ea",
                    borderRight: "1px solid #dbe7f3",
                    fontSize: "0.98rem",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span>{heading}</span>
                    <MoreVertical size={16} color="#5b7798" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{padding: "1.2rem", color: "#587698"}}>
                  Loading contacts...
                </td>
              </tr>
            ) : filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{padding: "1.2rem", color: "#587698"}}>
                  No contacts found.
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr key={contact.email}>
                  <td style={{padding: "0.82rem 0.85rem", borderBottom: "1px solid #e2e8f0"}}>
                    {contact.name}
                  </td>
                  <td style={{padding: "0.82rem 0.85rem", borderBottom: "1px solid #e2e8f0"}}>
                    {contact.email}
                  </td>
                  <td style={{padding: "0.82rem 0.85rem", borderBottom: "1px solid #e2e8f0"}}>
                    {contact.phoneNumber || ""}
                  </td>
                  <td style={{padding: "0.82rem 0.85rem", borderBottom: "1px solid #e2e8f0"}}>
                    {formatDateCell(contact.lastMeetingDate)}
                  </td>
                  <td style={{padding: "0.82rem 0.85rem", borderBottom: "1px solid #e2e8f0"}}>
                    {formatDateCell(contact.nextMeetingDate)}
                  </td>
                  <td style={{padding: "0.82rem 0.85rem", borderBottom: "1px solid #e2e8f0"}}>
                    {contact.company || ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contacts;
