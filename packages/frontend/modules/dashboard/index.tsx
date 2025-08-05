import { Span } from "@components/html";
import { DashboardWrapper, ProjectWrapper } from "@modules/dashboard/styles";
import { DashboardProps } from "@modules/dashboard/types";
import { AddRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";

const Dashboard = ({ className, projects = [] }: DashboardProps) => {
  console.log("Projects:", projects);
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
          projects.map((project) => (
            <ProjectWrapper key={project.id}>
              <Span>
                <Span $weight="600">ID: </Span>
                <Span>{project.id}</Span>
              </Span>
              <Span>
                <Span $weight="600">Name: </Span>
                <Span>{project.name}</Span>
              </Span>
              <Span>
                <Span $weight="600">Target URL: </Span>
                <Span>{project.targetUrl}</Span>
              </Span>
              <Span>
                <Span $weight="600">Created at: </Span>
                <Span>{new Date(project.createdAt).toDateString()}</Span>
              </Span>
            </ProjectWrapper>
          ))
        )}
      </main>
    </DashboardWrapper>
  );
};

export default Dashboard;
