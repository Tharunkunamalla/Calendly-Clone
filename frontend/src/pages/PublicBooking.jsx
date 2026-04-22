import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  eachDayOfInterval,
  isPast,
  isToday,
} from "date-fns";
import {ChevronLeft, ChevronRight, Clock, Globe, Calendar} from "lucide-react";
import {eventTypeApi, meetingApi} from "../utils/api";
import {toast} from "react-toastify";

const PublicBooking = () => {
  const {slug} = useParams();
  const navigate = useNavigate();
  const [eventType, setEventType] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Form state
  const [formData, setFormData] = useState({name: "", email: "", phone: ""});
  const [phoneError, setPhoneError] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchEventType();
  }, [slug]);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots();
    }
  }, [selectedDate]);

  const fetchEventType = async () => {
    try {
      const {data} = await eventTypeApi.getBySlug(slug);
      setEventType(data);
    } catch (error) {
      console.error("Event type not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const {data} = await meetingApi.getSlots(
        format(selectedDate, "yyyy-MM-dd"),
        slug,
      );
      setAvailableSlots(data);
    } catch (error) {
      console.error("Failed to fetch slots");
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const normalizedPhone = formData.phone.trim();
    if (!/^\+?[0-9\s()-]{7,20}$/.test(normalizedPhone)) {
      setPhoneError("A valid phone number is required.");
      return;
    }

    setPhoneError("");
    setBooking(true);
    try {
      await meetingApi.book({
        inviteeName: formData.name,
        inviteeEmail: formData.email,
        inviteePhone: normalizedPhone,
        startTime: selectedSlot,
        eventTypeId: eventType.id,
      });
      toast.success("Event scheduled successfully!");
      navigate(
        `/p/${slug}/confirm?name=${formData.name}&email=${formData.email}&time=${selectedSlot}`,
      );
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Booking failed. Please try again.",
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div>Loading booking page...</div>;
  if (!eventType) return <div>Event link is invalid.</div>;

  // Calendar logic
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  return (
    <div className="page-shell" style={{padding: "2.5rem 1.5rem 3rem"}}>
      <div
        className="page-card"
        style={{
          maxWidth: showForm ? "640px" : "1080px",
          margin: "0 auto",
          display: "flex",
          flexDirection: showForm ? "column" : "row",
          padding: 0,
          overflow: "hidden",
          minHeight: "640px",
        }}
      >
        {/* Left Side: Info */}
        <div
          style={{
            width: showForm ? "100%" : "34%",
            padding: "2.5rem",
            borderRight: showForm ? "none" : "1px solid var(--border)",
            borderBottom: showForm ? "1px solid var(--border)" : "none",
            background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
          }}
        >
          <button
            type="button"
            onClick={() => (showForm ? setShowForm(false) : navigate("/"))}
            className="btn btn-outline"
            style={{marginBottom: "2.5rem", fontSize: "0.9rem"}}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <h2
            className="section-title"
            style={{fontSize: "1.5rem", marginBottom: "1rem"}}
          >
            Admin
          </h2>
          <h1
            className="section-title"
            style={{
              fontSize: "2.1rem",
              marginBottom: "1.5rem",
              lineHeight: 1.08,
            }}
          >
            {eventType.name}
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              color: "var(--text-muted)",
            }}
          >
            <div
              style={{display: "flex", alignItems: "center", gap: "0.75rem"}}
            >
              <Clock size={20} />{" "}
              <span style={{fontWeight: "600"}}>{eventType.duration} min</span>
            </div>
            {selectedSlot && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  color: "var(--primary)",
                  fontWeight: "600",
                }}
              >
                <Calendar size={20} />{" "}
                {format(new Date(selectedSlot), "h:mma, EEEE, MMM do")}
              </div>
            )}
            <div
              style={{display: "flex", alignItems: "center", gap: "0.75rem"}}
            >
              <Globe size={20} /> <span>UTC Timezone</span>
            </div>
          </div>

          {eventType.description && (
            <p
              style={{
                marginTop: "2rem",
                color: "var(--text-muted)",
                lineHeight: 1.7,
              }}
            >
              {eventType.description}
            </p>
          )}
        </div>

        {/* Right Side: Selection/Form */}
        <div
          style={{
            flex: 1,
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)",
          }}
        >
          {!showForm ? (
            <>
              <h2
                className="section-title"
                style={{fontSize: "1.35rem", marginBottom: "1.75rem"}}
              >
                Select a Date & Time
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  flex: 1,
                  alignItems: "flex-start",
                }}
              >
                {/* Calendar View */}
                <div style={{flex: 1}}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <h3 style={{fontWeight: "700", fontSize: "1.05rem"}}>
                      {format(currentMonth, "MMMM yyyy")}
                    </h3>
                    <div style={{display: "flex", gap: "0.75rem"}}>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentMonth(subMonths(currentMonth, 1))
                        }
                        className="calendar-nav-button"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentMonth(addMonths(currentMonth, 1))
                        }
                        className="calendar-nav-button"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                      (d) => (
                        <div
                          key={d}
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            fontWeight: "bold",
                            padding: "0.5rem",
                          }}
                        >
                          {d}
                        </div>
                      ),
                    )}
                    {days.map((day, i) => {
                      const isDisabled =
                        !isSameMonth(day, currentMonth) ||
                        (isPast(day) && !isToday(day));
                      const isSelected =
                        selectedDate && isSameDay(day, selectedDate);

                      return (
                        <button
                          key={i}
                          disabled={isDisabled}
                          onClick={() => setSelectedDate(day)}
                          style={{
                            height: "42px",
                            borderRadius: "50%",
                            background: isSelected
                              ? "var(--primary)"
                              : "transparent",
                            color: isSelected
                              ? "white"
                              : isDisabled
                                ? "#ccc"
                                : "var(--primary)",
                            fontWeight: isSelected ? "700" : "600",
                            cursor: isDisabled ? "default" : "pointer",
                            fontSize: "0.9rem",
                            border: isSelected ? "none" : "none",
                            transition: "var(--transition)",
                          }}
                          className={
                            !isDisabled && !isSelected ? "cal-day" : ""
                          }
                        >
                          {format(day, "d")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slots View */}
                {selectedDate && (
                  <div
                    className="time-slot-panel"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: "700",
                        fontSize: "1rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {format(selectedDate, "EEEE, MMM d")}
                    </h3>
                    <div
                      style={{
                        overflowY: "auto",
                        maxHeight: "440px",
                        paddingRight: "0.5rem",
                      }}
                      className="custom-scroll time-slot-grid"
                    >
                      {availableSlots.length === 0 ? (
                        <p
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.875rem",
                          }}
                        >
                          No slots available
                        </p>
                      ) : (
                        availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => {
                              setSelectedSlot(slot);
                              setShowForm(true);
                            }}
                            className="slot-button"
                          >
                            {format(new Date(slot), "h:mma")}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <form
              onSubmit={handleBooking}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.35rem",
                maxWidth: "520px",
              }}
            >
              <h2 className="section-title" style={{fontSize: "1.35rem"}}>
                Enter Details
              </h2>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({...formData, name: e.target.value})
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({...formData, email: e.target.value})
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Invitee's phone number *</label>
                <input
                  type="tel"
                  className="form-input"
                  required
                  placeholder="+1 555 123 4567"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({...formData, phone: e.target.value});
                    if (phoneError) setPhoneError("");
                  }}
                  style={
                    phoneError
                      ? {
                          borderColor: "#dc2626",
                          boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.12)",
                        }
                      : undefined
                  }
                />
                {phoneError && (
                  <p
                    style={{
                      fontSize: "0.84rem",
                      color: "#dc2626",
                      marginTop: "0.4rem",
                    }}
                  >
                    {phoneError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{justifyContent: "center", marginTop: "0.25rem"}}
                disabled={booking}
              >
                {booking ? "Booking..." : "Schedule Event"}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .cal-day:hover {
          background: var(--primary-light) !important;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #eee;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default PublicBooking;
