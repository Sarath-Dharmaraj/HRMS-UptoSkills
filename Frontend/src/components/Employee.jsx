"use client"

import { useMemo, useState } from "react"

const PRIMARY = "text-blue-600"
const PRIMARY_BG = "bg-blue-600"
const NEUTRAL_BG = "bg-white"
const NEUTRAL_BORDER = "border-gray-200"
const NEUTRAL_TEXT = "text-gray-700"
const MUTED_TEXT = "text-gray-500"

function classNames(...cls) {
  return cls.filter(Boolean).join(" ")
}

function TypeBadge({ type }) {
  const map = {
    "Full-Time": "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
    "Part-Time": "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    Contract: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  }
  return (
    <span
      className={classNames(
        "px-2 py-1 text-xs font-medium rounded-full",
        map[type] || "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200",
      )}
    >
      {type || "—"}
    </span>
  )
}

function ControlsSection({
  view,
  setView,
  search,
  setSearch,
  department,
  setDepartment,
  type,
  setType,
  sortBy,
  setSortBy,
  departmentOptions,
  onExport,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center text-gray-500">
  <div className="flex items-center gap-2  ">
    <button
      className={classNames(
        "px-3 py-2 rounded-md text-sm font-medium border",
        view === "list"
          ? PRIMARY_BG + " text-white border-transparent"
          : "bg-white border " + NEUTRAL_BORDER + " " + NEUTRAL_TEXT,
      )}
      onClick={() => setView("list")}
    >
      View Employees
    </button>
    <button
      className={classNames(
        "px-3 py-2 rounded-md text-sm font-medium border",
        view === "add"
          ? PRIMARY_BG + " text-white border-transparent"
          : "bg-white border " + NEUTRAL_BORDER + " " + NEUTRAL_TEXT,
      )}
      onClick={() => setView("add")}
    >
      Add Employee
    </button>
  </div>

  {view === "list" && (
  <div className="flex flex-col md:flex-row md:items-center gap-5 w-full md:w-auto">
    {/* Search */}
    <div className="relative">
      <label htmlFor="search" className="sr-only ">
        Search
      </label>
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12.9 14.32a8 8 0 111.414-1.414l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
          clipRule="evenodd"
        />
      </svg>
      <input
        id="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-white placeholder-gray-400 text-sm w-max hover:border-black"

        style={{ minWidth: "270px" }}
        placeholder="Search by name, email, or position"
      />
    </div>


      {/* Department and Type */}
      <div className="flex gap-5 w-full md:w-auto">
        <div>
          <label htmlFor="dept" className="sr-only">
            Department
          </label>
          <select
            id="dept"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm hover:border-black"
          >
            <option value="All">All Departments</option>
            {departmentOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className="sr-only">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm hover:border-black"
          >
            <option value="All">All Types</option>
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Contract</option>
          </select>
        </div>
      </div>

      {/* Sort / Export */}
      <div className="flex gap-5 w-full md:w-auto">
        <div>
          <label htmlFor="sortBy" className="sr-only">
            Sort by
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm hover:border-black"
          >
            <option value="name">Sort: Name</option>
            <option value="id">Sort: ID</option>
            <option value="department">Sort: Department</option>
          </select>
        </div>
        <button
          onClick={onExport}
          className="w-full px-3 py-2 rounded-md border border-blue-200 bg-white text-blue-700 text-sm font-medium md:w-auto hover:bg-blue-700 hover:text-white"
        >
          Export CSV
        </button>
      </div>
    </div>
  )}
</div>
  )
}

const Employee = () => {
  const [view, setView] = useState("list")
  const [banner, setBanner] = useState(null) // { type: 'success' | 'error', message: string }

  const [employees, setEmployees] = useState([
    {
      id: 5028,
      name: "Kristin Watson",
      position: "Medical Assistant",
      type: "Full-Time",
      department: "Health",
      email: "kristin.watson@example.com",
    },
    {
      id: 7791,
      name: "Bessie Cooper",
      position: "Nursing Assistant",
      type: "Part-Time",
      department: "Health",
      email: "bessie.cooper@example.com",
    },
    {
      id: 3933,
      name: "Annette Black",
      position: "Dog Trainer",
      type: "Part-Time",
      department: "Training",
      email: "annette.black@example.com",
    },
    {
      id: 8829,
      name: "Eleanor Pena",
      position: "President of Sales",
      type: "Full-Time",
      department: "Sales",
      email: "eleanor.pena@example.com",
    },
    {
      id: 4600,
      name: "Jenny Wilson",
      position: "Marketing Coordinator",
      type: "Full-Time",
      department: "Marketing",
      email: "jenny.wilson@example.com",
    },
    {
      id: 8811,
      name: "Devon Lane",
      position: "Web Designer",
      type: "Full-Time",
      department: "Design",
      email: "devon.lane@example.com",
    },
  ])

  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("All")
  const [type, setType] = useState("All")
  const [sortBy, setSortBy] = useState("name")

  const departmentOptions = useMemo(() => {
    const set = new Set(employees.map((e) => e.department).filter(Boolean))
    return Array.from(set).sort()
  }, [employees])

  const filtered = useMemo(() => {
    let list = [...employees]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          (e.position || "").toLowerCase().includes(q),
      )
    }
    if (department !== "All") {
      list = list.filter((e) => e.department === department)
    }
    if (type !== "All") {
      list = list.filter((e) => e.type === type)
    }
    list.sort((a, b) => {
      if (sortBy === "id") return a.id - b.id
      if (sortBy === "department") return (a.department || "").localeCompare(b.department || "")
      return a.name.localeCompare(b.name)
    })
    return list
  }, [employees, search, department, type, sortBy])

  // CSV Export
  const handleExport = () => {
    const rows = [
      ["ID", "Name", "Position", "Type", "Department", "Email"],
      ...filtered.map((e) => [e.id, e.name, e.position, e.type, e.department, e.email]),
    ]
    const csv = rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "employees.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Add form state
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    role: "",
    department: "",
    id: "",
    type: "",
    email: "",
  })
  const [errors, setErrors] = useState({})

  const handleFormChange = (e) => {
    setEmployeeForm({ ...employeeForm, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!employeeForm.name.trim()) newErrors.name = "Name is required."
    if (!employeeForm.role.trim()) newErrors.role = "Role is required."
    if (!employeeForm.department.trim()) newErrors.department = "Department is required."
    if (!employeeForm.id) newErrors.id = "ID is required."
    if (!employeeForm.type) newErrors.type = "Type is required."
    if (!employeeForm.email) newErrors.email = "Email is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeForm.email)) newErrors.email = "Enter a valid email."
    if (employeeForm.id && employees.some((emp) => emp.id === Number(employeeForm.id))) {
      newErrors.id = "An employee with this ID already exists."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) {
      setBanner({ type: "error", message: "Please fix the errors and try again." })
      return
    }
    const newEmp = {
      id: Number(employeeForm.id),
      name: employeeForm.name.trim(),
      position: employeeForm.role.trim(),
      type: employeeForm.type,
      department: employeeForm.department.trim(),
      email: employeeForm.email.trim(),
    }
    setEmployees((prev) => [...prev, newEmp])
    setEmployeeForm({ name: "", role: "", department: "", id: "", type: "", email: "" })
    setErrors({})
    setBanner({ type: "success", message: "Employee added successfully." })
    setView("list")
    // Optionally scroll to top to show banner
    try {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {}
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 text-balance">Employees</h1>
          <p className={classNames("mt-1 text-sm", MUTED_TEXT)}>
            Manage your team, search records, and add new employees.
          </p>
        </header>

        {/* Banner */}
        {banner?.message && (
          <div
            role="status"
            className={classNames(
              "mb-4 rounded-md border px-4 py-3 text-sm",
              banner.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800",
            )}
          >
            {banner.message}
          </div>
        )}

        {/* Controls */}
        <div className={classNames("rounded-lg border", NEUTRAL_BORDER, NEUTRAL_BG, "p-4 shadow-sm")}>
          <ControlsSection
            view={view}
            setView={setView}
            search={search}
            setSearch={setSearch}
            department={department}
            setDepartment={setDepartment}
            type={type}
            setType={setType}
            sortBy={sortBy}
            setSortBy={setSortBy}
            departmentOptions={departmentOptions}
            onExport={handleExport}
          />
        </div>

        {/* Content */}
        {view === "list" ? (
          <div className="mt-6">
            {/* Mobile Cards */}
            <ul className="grid grid-cols-1 gap-4 md:hidden">
              {filtered.length === 0 && (
                <li className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
                  <p className="text-sm text-gray-600">No employees found. Try adjusting your filters.</p>
                </li>
              )}
              {filtered.map((emp, i) => (
                <li key={emp.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <img
                      src={`https://i.pravatar.cc/64?img=${(i % 70) + 1}`}
                      alt={`${emp.name} avatar`}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900">{emp.name}</h3>
                        <TypeBadge type={emp.type} />
                      </div>
                      <p className={classNames("mt-0.5 text-sm", MUTED_TEXT)}>{emp.position}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-700">{emp.department}</div>
                        <div className="truncate text-xs text-blue-700">{emp.email}</div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">ID: {emp.id}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Employee
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Position
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Department
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-600">
                            No employees found. Try adjusting your filters.
                          </td>
                        </tr>
                      )}
                      {filtered.map((emp, i) => (
                        <tr key={emp.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700">{emp.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://i.pravatar.cc/32?img=${(i % 70) + 1}`}
                                alt=""
                                className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none"
                                }}
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                                <div className="text-xs text-gray-500">{emp.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{emp.position}</td>
                          <td className="px-4 py-3">
                            <TypeBadge type={emp.type} />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{emp.department}</td>
                          <td className="px-4 py-3">
                            <a href={`mailto:${emp.email}`} className="text-sm text-blue-700 hover:underline">
                              {emp.email}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Add Employee Form
          <div className="mt-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Add New Employee</h2>
              <p className={classNames("mt-1 text-sm", MUTED_TEXT)}>
                Fill in the details below to add a new employee. All fields are required.
              </p>

              <form onSubmit={handleFormSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Employee Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={employeeForm.name}
                    onChange={handleFormChange}
                    placeholder="e.g., Jane Cooper"
                    className={classNames(
                      "mt-1 w-full rounded-md border px-3 py-2 text-sm hover:border-gray-400",
                      errors.name
                        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                        : "border-gray-200 focus:border-blue-400 focus:ring-blue-100",
                    )}
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={employeeForm.role}
                    onChange={handleFormChange}
                    className={classNames(
                      "mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white hover:border-gray-400",
                      errors.role
                        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                        : "border-gray-200 focus:border-blue-400 focus:ring-blue-100",
                    )}
                  >
                    <option value="">Select role</option>
                    <option>Chartered Accountant</option>
                    <option>Developer</option>
                    <option>HR Manager</option>
                    <option>Web Designer</option>
                    <option>Marketing Coordinator</option>
                    <option>President of Sales</option>
                  </select>
                  {errors.role && <p className="mt-1 text-xs text-rose-600">{errors.role}</p>}
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <input
                    id="department"
                    name="department"
                    value={employeeForm.department}
                    onChange={handleFormChange}
                    placeholder="e.g., Marketing"
                    className={classNames(
                      "mt-1 w-full rounded-md border px-3 py-2 text-sm hover:border-gray-400",
                      errors.department
                        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                        : "border-gray-200 focus:border-blue-400 focus:ring-blue-100",
                    )}
                  />
                  {errors.department && <p className="mt-1 text-xs text-rose-600">{errors.department}</p>}
                </div>

                <div>
                  <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                    Employee ID
                  </label>
                  <input
                    id="id"
                    type="number"
                    name="id"
                    value={employeeForm.id}
                    onChange={handleFormChange}
                    placeholder="e.g., 1001"
                    className={classNames(
                      "mt-1 w-full rounded-md border px-3 py-2 text-sm hover:border-gray-400",
                      errors.id
                        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                        : "border-gray-200 focus:border-blue-400 focus:ring-blue-100",
                    )}
                  />
                  {errors.id && <p className="mt-1 text-xs text-rose-600">{errors.id}</p>}
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={employeeForm.type}
                    onChange={handleFormChange}
                    className={classNames(
                      "mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white hover:border-gray-400",
                      errors.type
                        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                        : "border-gray-200 focus:border-blue-400 focus:ring-blue-100",
                    )}
                  >
                    <option value="">Select type</option>
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                  </select>
                  {errors.type && <p className="mt-1 text-xs text-rose-600">{errors.type}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={employeeForm.email}
                    onChange={handleFormChange}
                    placeholder="name@example.com"
                    className={classNames(
                      "mt-1 w-full rounded-md border px-3 py-2 text-sm hover:border-gray-400 hover:border-gray-400",
                      errors.email
                        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                        : "border-gray-200 focus:border-blue-400 focus:ring-blue-100",
                    )}
                  />
                  {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                </div>

                <div className="md:col-span-2 mt-2">
                  <button
                    type="submit"
                    className={classNames(
                      "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm",
                      PRIMARY_BG,
                      "hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-300",
                    )}
                  >
                    Save Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Employee
