import React from "react";
import styled from "styled-components";

const resources = [
  {
    name: "National Suicide Prevention Lifeline",
    url: "https://suicidepreventionlifeline.org/",
    description: "24/7 free and confidential support for people in distress."
  },
  {
    name: "Crisis Text Line",
    url: "https://www.crisistextline.org/",
    description: "Text HOME to 741741 to connect with a crisis counselor."
  },
  {
    name: "Mental Health America",
    url: "https://www.mhanational.org/",
    description: "Resources and support for mental health conditions."
  },
  {
    name: "NAMI - National Alliance on Mental Illness",
    url: "https://www.nami.org/Home",
    description: "Education, advocacy, and support for mental health."
  },
  {
    name: "Anxiety and Depression Association of America",
    url: "https://adaa.org/",
    description: "Information and resources for anxiety, depression, and related disorders."
  },
  {
    name: "SAMHSA Disaster Distress Helpline",
    url: "https://www.samhsa.gov/find-help/disaster-distress-helpline",
    description: "Helpline for emotional distress related to natural or human-caused disasters."
  }
];

const Container = styled.section`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 0 16px rgb(0 0 0 / 0.1);
  max-height: 90vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  margin: 0 0 16px 0;
  color: ${(props) => props.theme.colors.secondary};
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  margin-bottom: 18px;
`;

const ResourceName = styled.a`
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.1rem;
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

const Description = styled.p`
  margin: 4px 0 0 0;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.95rem;
`;

function Resources() {
  return (
    <Container aria-label="Mental Health Resources">
      <Title>Mental Health Resources</Title>
      <List>
        {resources.map(({ name, url, description }) => (
          <ListItem key={name}>
            <ResourceName href={url} target="_blank" rel="noopener noreferrer">
              {name}
            </ResourceName>
            <Description>{description}</Description>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Resources;
