import { Span } from "@components/html";
import { DashboardWrapper } from "@modules/dashboard/styles";
import { DashboardProps } from "@modules/dashboard/types";
import { AddRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";

const Dashboard = ({ className, projects = [] }: DashboardProps) => {
  return (
    <DashboardWrapper className={className} bg="var(--color-background-300)">
      <header className="header">
        <Span>Your Projects:</Span>
        <Button startIcon={<AddRounded />} variant="outlined">
          New Project
        </Button>
      </header>
      <main className="main">
        {projects.length === 0 ? (
          <Span>No projects found</Span>
        ) : (
          projects.map((project) => <div key={project.id}>{project.name}</div>)
        )}
      </main>
    </DashboardWrapper>
  );
};

export default Dashboard;
