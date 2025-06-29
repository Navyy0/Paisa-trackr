import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const formatRupees = (amount) =>
  `₹${parseFloat(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here’s your financial summary for {data?.month}:
            </Text>

            {/* Main Stats */}
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Income</Text>
                <Text style={styles.heading}>
                  {formatRupees(data?.stats.totalIncome)}
                </Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Expenses</Text>
                <Text style={styles.heading}>
                  {formatRupees(data?.stats.totalExpenses)}
                </Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Net</Text>
                <Text style={styles.heading}>
                  {formatRupees(
                    data?.stats.totalIncome - data?.stats.totalExpenses
                  )}
                </Text>
              </div>
            </Section>

            {/* Category Breakdown */}
            {data?.stats?.byCategory && (
              <Section style={styles.section}>
                <Heading style={styles.subHeading}>Expenses by Category</Heading>
                {Object.entries(data?.stats.byCategory).map(
                  ([category, amount]) => (
                    <div key={category} style={styles.row}>
                      <Text style={styles.text}>{category}</Text>
                      <Text style={styles.text}>{formatRupees(amount)}</Text>
                    </div>
                  )
                )}
              </Section>
            )}

            {/* AI Insights */}
            {data?.insights && (
              <Section style={styles.section}>
                <Heading style={styles.subHeading}>AI Insights</Heading>
                {data.insights.map((insight, index) => (
                  <Text key={index} style={styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              Thank you for using our service. Stay financially healthy!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "budget-alert") {
    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              You’ve used {data?.percentageUsed.toFixed(1)}% of your monthly
              budget.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Budget Amount</Text>
                <Text style={styles.heading}>
                  {formatRupees(data?.budgetAmount)}
                </Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Spent So Far</Text>
                <Text style={styles.heading}>
                  {formatRupees(data?.totalExpenses)}
                </Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Remaining</Text>
                <Text style={styles.heading}>
                  {formatRupees(data?.budgetAmount - data?.totalExpenses)}
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }
}

const styles = {
  body: {
    backgroundColor: "#0c162d",
    fontFamily: "Arial, sans-serif",
    color: "#ffffff",
    padding: "20px",
  },
  container: {
    backgroundColor: "#ffffff",
    color: "#0c162d",
    margin: "0 auto",
    padding: "24px",
    borderRadius: "8px",
    maxWidth: "600px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  title: {
    color: "#facc15",
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "24px",
  },
  heading: {
    color: "#0c162d",
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 8px",
  },
  subHeading: {
    color: "#facc15",
    fontSize: "18px",
    fontWeight: "600",
    margin: "16px 0",
  },
  text: {
    color: "#1f2937",
    fontSize: "16px",
    margin: "4px 0",
  },
  section: {
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#fffbea",
    borderRadius: "6px",
  },
  stat: {
    marginBottom: "12px",
    padding: "12px",
    backgroundColor: "#fefce8",
    borderRadius: "4px",
    border: "1px solid #fde68a",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    padding: "8px 0",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
};
