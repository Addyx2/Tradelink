import type { AppSessionUser } from "@/lib/auth";
import type { BatchWithSupplier, DashboardMetrics, Shipment, UserRole } from "@/lib/types";

export interface RoleDashboardConfig {
  eyebrow: string;
  title: string;
  description: string;
  metricLabels: [string, string, string, string, string];
  recommendedActionsTitle: string;
  recommendedActions: string[];
  primaryTableTitle: string;
}

export interface NavigationItem {
  href: string;
  label: string;
  roles: UserRole[];
}

export interface RoleCopilotConfig {
  title: string;
  description: string;
  prompts: string[];
  scope: string[];
  capabilities: Array<{
    title: string;
    description: string;
  }>;
}

export const navigationItems: NavigationItem[] = [
  { href: "/", label: "Dashboard", roles: ["trademaster", "trade_officer_compliance", "trade_officer_inspection", "supplier", "client"] },
  { href: "/shipments", label: "Shipments", roles: ["trademaster", "trade_officer_compliance", "trade_officer_inspection", "client"] },
  { href: "/batches", label: "Batches & Compliance", roles: ["trademaster", "trade_officer_compliance", "trade_officer_inspection", "supplier"] },
  { href: "/documents", label: "eBDL Documents", roles: ["trademaster", "trade_officer_compliance", "client"] },
  { href: "/suppliers", label: "Suppliers", roles: ["trademaster", "trade_officer_compliance", "trade_officer_inspection"] },
  { href: "/copilot", label: "Copilot", roles: ["trademaster", "trade_officer_compliance", "trade_officer_inspection", "supplier", "client"] },
];

export function getNavigationForRole(role: UserRole) {
  return navigationItems.filter((item) => item.roles.includes(role));
}

export function getRoleLabel(role: UserRole) {
  switch (role) {
    case "trademaster":
      return "Trademaster";
    case "trade_officer_compliance":
      return "Trade Officer · Compliance";
    case "trade_officer_inspection":
      return "Trade Officer · Inspection";
    case "supplier":
      return "Supplier";
    case "client":
      return "Client";
  }
}

export function getRoleDashboardConfig(user: AppSessionUser): RoleDashboardConfig {
  switch (user.role) {
    case "trade_officer_compliance":
      return {
        eyebrow: "Compliance desk",
        title: "Due diligence and release readiness",
        description: "Focus on EUDR evidence, batch risk, and release blockers across active shipments.",
        metricLabels: ["Batches in review", "EUDR ready", "Evidence completion", "Blocked batches", "Shipments needing sign-off"],
        recommendedActionsTitle: "Compliance queue",
        recommendedActions: [
          "Clear missing polygon evidence for BAT-2402.",
          "Escalate BAT-2403 blocked status for senior approval.",
          "Confirm eBDL amendments for shipments with customs sensitivity.",
        ],
        primaryTableTitle: "Batches requiring compliance attention",
      };
    case "trade_officer_inspection":
      return {
        eyebrow: "Inspection desk",
        title: "Inspection health and incident readiness",
        description: "Track anomalies, inspect cargo condition, and escalate shipment or batch incidents quickly.",
        metricLabels: ["Shipments to inspect", "Telemetry healthy", "Open anomalies", "Humidity alerts", "Cargo on hold"],
        recommendedActionsTitle: "Inspection queue",
        recommendedActions: [
          "Inspect SHP-1002 for humidity-related cargo risk.",
          "Review route deviation evidence on SHP-1003.",
          "Log outcome of container seal verification before release.",
        ],
        primaryTableTitle: "Operational alerts and telemetry exceptions",
      };
    case "supplier":
      return {
        eyebrow: "Supplier workspace",
        title: "Your batch submissions and evidence status",
        description: "Monitor your batches, complete missing provenance data, and keep release workflows moving.",
        metricLabels: ["Your batches", "Ready batches", "Evidence completion", "Items in review", "Documents pending"],
        recommendedActionsTitle: "Supplier tasks",
        recommendedActions: [
          "Upload missing forest polygon for BAT-2402.",
          "Review requested edits on recently submitted due diligence files.",
          "Confirm latest cargo packaging metadata before vessel loading.",
        ],
        primaryTableTitle: "Your batches and submission status",
      };
    case "client":
      return {
        eyebrow: "Client portal",
        title: "Shipment progress and approved trade documents",
        description: "Track cargo progress, ETA confidence, and only the approved compliance and document information shared with you.",
        metricLabels: ["Active shipments", "ETA confidence", "Documents approved", "Cargo alerts", "Ready deliveries"],
        recommendedActionsTitle: "Client updates",
        recommendedActions: [
          "Track SHP-1001 arrival into Rotterdam.",
          "Review approved eBDL package for inbound cargo.",
          "Watch customs hold updates before scheduling receiving windows.",
        ],
        primaryTableTitle: "Customer-visible shipment readiness",
      };
    case "trademaster":
    default:
      return {
        eyebrow: "Control tower",
        title: "Telemetry, compliance, and trade execution in one workflow",
        description: "Tradelink gives Giants.earth a single operating surface for live shipment monitoring, eBDL orchestration, and EUDR batch readiness before cargo crosses borders.",
        metricLabels: ["Active shipments", "EUDR ready", "Telemetry healthy", "At-risk shipments", "Evidence complete"],
        recommendedActionsTitle: "Recommended actions",
        recommendedActions: [
          "Review BAT-2403 before customs release due to high forest-risk classification.",
          "Upload polygon evidence for BAT-2402 to move SHP-1002 out of review.",
          "Monitor route deviation on SHP-1003 and issue amended eBDL if destination leg changes.",
        ],
        primaryTableTitle: "EUDR readiness board",
      };
  }
}

export function getRoleMetrics(user: AppSessionUser, metrics: DashboardMetrics, shipments: Shipment[], batches: BatchWithSupplier[]) {
  switch (user.role) {
    case "trade_officer_compliance": {
      const reviewCount = batches.filter((batch) => batch.complianceStatus === "review").length;
      const blockedCount = batches.filter((batch) => batch.complianceStatus === "blocked").length;
      const signoffCount = shipments.filter((shipment) => shipment.riskScore >= 40).length;
      return [
        String(reviewCount),
        `${metrics.eudrReadyRate}%`,
        `${metrics.evidenceCompletionRate}%`,
        String(blockedCount),
        String(signoffCount),
      ];
    }
    case "trade_officer_inspection": {
      const anomalies = shipments.reduce((total, shipment) => total + shipment.alerts.length, 0);
      const humidityAlerts = shipments.filter((shipment) => shipment.alerts.some((alert) => alert.toLowerCase().includes("humidity"))).length;
      const onHold = shipments.filter((shipment) => shipment.status === "customs_hold").length;
      return [
        String(shipments.length),
        `${metrics.telemetryHealthyRate}%`,
        String(anomalies),
        String(humidityAlerts),
        String(onHold),
      ];
    }
    case "supplier": {
      const supplierBatches = batches.filter((batch) => batch.supplier?.name === user.organizationName);
      const readyCount = supplierBatches.filter((batch) => batch.complianceStatus === "ready").length;
      const reviewCount = supplierBatches.filter((batch) => batch.complianceStatus === "review").length;
      return [
        String(supplierBatches.length),
        String(readyCount),
        `${supplierBatches.length ? Math.round(supplierBatches.reduce((total, batch) => total + batch.evidenceComplete, 0) / supplierBatches.length) : 0}%`,
        String(reviewCount),
        String(Math.max(supplierBatches.length - readyCount, 0)),
      ];
    }
    case "client": {
      const approvedDocuments = shipments.filter((shipment) => shipment.ebdlId).length;
      const readyDeliveries = shipments.filter((shipment) => shipment.status === "delivered" || shipment.status === "in_transit").length;
      return [
        String(shipments.length),
        `${Math.max(metrics.telemetryHealthyRate - 4, 0)}%`,
        String(approvedDocuments),
        String(shipments.filter((shipment) => shipment.alerts.length > 0).length),
        String(readyDeliveries),
      ];
    }
    case "trademaster":
    default:
      return [
        String(metrics.activeShipments),
        `${metrics.eudrReadyRate}%`,
        `${metrics.telemetryHealthyRate}%`,
        String(metrics.atRiskShipments),
        `${metrics.evidenceCompletionRate}%`,
      ];
  }
}

export function getDashboardShipmentsForRole(user: AppSessionUser, shipments: Shipment[]) {
  switch (user.role) {
    case "client":
      return shipments.filter((shipment) => shipment.status !== "customs_hold");
    default:
      return shipments;
  }
}

export function getDashboardBatchesForRole(user: AppSessionUser, batches: BatchWithSupplier[]) {
  switch (user.role) {
    case "supplier":
      return batches.filter((batch) => batch.supplier?.name === user.organizationName);
    case "client":
      return batches.filter((batch) => batch.complianceStatus !== "blocked");
    default:
      return batches;
  }
}

export function getRoleCopilotConfig(user: AppSessionUser): RoleCopilotConfig {
  switch (user.role) {
    case "trade_officer_compliance":
      return {
        title: "Compliance copilot for EUDR and trade readiness",
        description: "Ask the copilot to summarize risk, explain blockers, and suggest the next due diligence actions.",
        prompts: [
          "Which batches are blocked for EUDR and why?",
          "Summarize missing evidence for today's release queue.",
          "Draft a compliance summary for SHP-1002.",
        ],
        scope: [
          "Batch-level provenance and evidence completeness",
          "EUDR status, due diligence, and release blockers",
          "eBDL context where relevant to compliance decisions",
        ],
        capabilities: [
          { title: "Risk explanation", description: "Explain why a batch or shipment is flagged in operational language." },
          { title: "Due diligence guidance", description: "Recommend the next documents or evidence to unblock trade flows." },
        ],
      };
    case "trade_officer_inspection":
      return {
        title: "Inspection copilot for telemetry and cargo health",
        description: "Ask the copilot to surface anomalies, summarize shipment incidents, and guide inspection actions.",
        prompts: [
          "Which shipments need inspection today?",
          "Summarize telemetry anomalies for SHP-1003.",
          "What should I verify before releasing a humidity-flagged container?",
        ],
        scope: [
          "Telemetry events, shipment alerts, and operational anomalies",
          "Cargo health and inspection-related action planning",
          "Incident review and escalation assistance",
        ],
        capabilities: [
          { title: "Alert triage", description: "Turn raw telemetry signals into inspection priorities." },
          { title: "Inspection checklist", description: "Suggest cargo and container checks based on the incident context." },
        ],
      };
    case "supplier":
      return {
        title: "Supplier copilot for provenance submissions",
        description: "Ask the copilot to explain missing evidence, review batch readiness, and suggest what to upload next.",
        prompts: [
          "Which of my batches are missing evidence?",
          "What do I need to upload for BAT-2402?",
          "Summarize review feedback on my latest submission.",
        ],
        scope: [
          "Only the supplier's own batches and submission state",
          "Evidence completion, provenance gaps, and review feedback",
          "No visibility into other suppliers or restricted client data",
        ],
        capabilities: [
          { title: "Submission guidance", description: "Tell suppliers what data or documents are missing." },
          { title: "Readiness summary", description: "Summarize how close each batch is to release readiness." },
        ],
      };
    case "client":
      return {
        title: "Client copilot for shipment visibility",
        description: "Ask the copilot to summarize shipment progress, ETA confidence, and approved document readiness.",
        prompts: [
          "What shipments are arriving this week?",
          "Summarize the status of SHP-1001.",
          "Which approved documents are ready for my cargo?",
        ],
        scope: [
          "Customer-visible shipment milestones and ETA summaries",
          "Approved trade documents and release visibility",
          "No internal-only compliance or supplier-sensitive data",
        ],
        capabilities: [
          { title: "Status summaries", description: "Provide a simple customer-facing view of shipment progress." },
          { title: "Document readiness", description: "Explain what approved documents are available for each shipment." },
        ],
      };
    case "trademaster":
    default:
      return {
        title: "Operational copilot for Tradelink control tower",
        description: "Ask the copilot to summarize fleet risk, explain compliance blockers, and recommend cross-functional actions.",
        prompts: [
          "Which shipments need attention now?",
          "Summarize all high-risk batches across the network.",
          "What actions should operations and compliance take today?",
        ],
        scope: [
          "Cross-workflow shipment, batch, document, and supplier insight",
          "Risk, compliance, and operational summaries for Trademasters",
          "Multi-team action suggestions across the control tower",
        ],
        capabilities: [
          { title: "Network summary", description: "Condense fleet status into a short operational briefing." },
          { title: "Action recommendations", description: "Recommend next actions for trade, compliance, and inspection teams." },
        ],
      };
  }
}
