import { axiosInstance } from "@/request";
import { Span } from "@components/html";
import {
  DialogContainer,
  IgnoredPathsWrapper,
} from "@modules/dashboard/styles";
import { Project } from "@modules/dashboard/types";
import { AddRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { inputBaseClasses } from "@mui/material/InputBase";
import TextField from "@mui/material/TextField";
import { FormEventHandler, useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";

interface AddDialogProps {
  open: boolean;
  onClose: () => void;
  addProject: (project: Project) => void;
}

const AddDialog = ({ open, onClose, addProject }: AddDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [ignoredPaths, setIgnoredPaths] = useState<string[]>([]);
  const [ipTextValue, setIpTextValue] = useState("");

  const addIgnoredPathHandler = () => {
    const newPath = ipTextValue.trim();
    if (newPath && !ignoredPaths.includes(newPath)) {
      setIgnoredPaths((prevPaths) => [...prevPaths, newPath]);
      setIpTextValue("");
    }
  };

  const addProjectHandler = useCallback(
    async (projectData: Omit<Project, "id" | "createdAt" | "scriptPath">) => {
      try {
        const { data } = await axiosInstance.post("/projects", projectData);
        toast.success("Project added successfully!");
        addProject(data);
      } catch (err) {
        toast.error("Failed to add project. Please try again.");
      }
    },
    [],
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      toast.info("Adding project...");
      const form = formRef.current;
      if (!form) return;
      const name = form.querySelector<HTMLInputElement>("#name")?.value;
      const targetUrl =
        form.querySelector<HTMLInputElement>("#targetUrl")?.value;
      if (!name || !targetUrl) return;
      const projectData: Omit<Project, "id" | "createdAt" | "scriptPath"> = {
        name,
        targetUrl,
        ignoredPaths,
      };
      void addProjectHandler(projectData);
      form.reset();
      setIgnoredPaths([]);
      setIpTextValue("");
      onClose();
    },
    [ignoredPaths],
  );
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContainer>
        <form onSubmit={handleSubmit} ref={formRef}>
          <FormControl>
            <TextField
              required
              size="small"
              id="name"
              label="Project Name"
              variant="outlined"
            />
            <TextField
              required
              size="small"
              id="targetUrl"
              label="Target URL"
              variant="outlined"
            />
            <IgnoredPathsWrapper>
              {ignoredPaths.length > 0 && (
                <div className="ignored-paths">
                  <Span $weight="600" className="ip-heading">
                    Ignored Paths:
                  </Span>
                  {ignoredPaths.map((path) => (
                    <Span
                      key={path}
                      className="path"
                      onClick={() => {
                        setIgnoredPaths((prev) =>
                          prev.filter((p) => p !== path),
                        );
                      }}
                    >
                      {path}
                    </Span>
                  ))}
                </div>
              )}
              <TextField
                size="small"
                id="ignoredPath"
                label="Ignored Path"
                variant="outlined"
                value={ipTextValue}
                onChange={(e) => setIpTextValue(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{
                          opacity: 0,
                          pointerEvents: "none",
                          [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]:
                            {
                              opacity: 1,
                              pointerEvents: "auto",
                            },
                        }}
                      >
                        <IconButton onClick={addIgnoredPathHandler}>
                          <AddRounded />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </IgnoredPathsWrapper>
            <Button type="submit" variant="contained" color="primary">
              Add Project
            </Button>
          </FormControl>
        </form>
      </DialogContainer>
    </Dialog>
  );
};

export default AddDialog;
