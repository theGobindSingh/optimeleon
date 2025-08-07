import { axiosInstance } from "@/request";
import { useUser } from "@clerk/nextjs";
import { Span } from "@components/html";
import AddDialog from "@modules/dashboard/add-dialog";
import { DashboardWrapper, ProjectWrapper } from "@modules/dashboard/styles";
import { DashboardProps, Project } from "@modules/dashboard/types";
import { AddRounded, DeleteRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Link from "next/link";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const Dashboard = ({
  className,
  projects: projectsWithoutState = [],
}: DashboardProps) => {
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  const newProjectHandler = () => {
    setNewProjectDialogOpen(true);
  };
  const newProjectCloseHandler = () => {
    setNewProjectDialogOpen(false);
  };

  // remove this
  const { user } = useUser();
  useEffect(() => {
    console.log({
      id: user?.id,
    });
  }, [user]);

  const [projects, setProjects] = useState<Project[]>(projectsWithoutState);

  const addProject = useCallback((project: Project) => {
    setProjects((prevProjects) => [...prevProjects, project]);
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    toast.info("Deleting project, please wait!");
    axiosInstance
      .delete(`/projects/${projectId}`)
      .then(() => {
        setProjects((prevProjects) => {
          return prevProjects.filter(({ id }) => id !== projectId);
        });
        toast.success("Project Deleted!");
      })
      .catch(() => {
        toast.error("Error! Project not deleted!");
      });
  }, []);

  const projectMapper = (project: Project) => {
    const clickHandler = () => {
      const scriptTag = `<script src="http://localhost:6969/load-base-script?id=${project.id}"></script>`;
      navigator.clipboard.writeText(scriptTag).then(
        () => {
          toast.success("Script tag copied to clipboard!");
        },
        () => {
          toast.error("Failed to copy script tag!");
        },
      );
    };
    const deleteHandler: MouseEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation();
      deleteProject(project.id);
    };
    return (
      <ProjectWrapper key={project.id} onClick={clickHandler}>
        <div className="del-wrapper" onClick={deleteHandler}>
          <DeleteRounded />
        </div>
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
          <Span suppressHydrationWarning>
            {new Date(project.createdAt).toDateString()}
          </Span>
        </Span>
      </ProjectWrapper>
    );
  };
  return (
    <DashboardWrapper className={className} bg="var(--color-background-300)">
      <header className="header">
        <Span className="first">Your Projects:</Span>
        <Link href="/test">
          <Button variant="outlined">Go to Test Page</Button>
        </Link>
        <Button
          startIcon={<AddRounded />}
          variant="outlined"
          onClick={newProjectHandler}
        >
          New Project
        </Button>
      </header>
      <main className="main">
        {projects.length === 0 ? (
          <Span>No projects found</Span>
        ) : (
          projects.map(projectMapper)
        )}
      </main>
      <AddDialog
        open={newProjectDialogOpen}
        onClose={newProjectCloseHandler}
        addProject={addProject}
      />
    </DashboardWrapper>
  );
};

export default Dashboard;
