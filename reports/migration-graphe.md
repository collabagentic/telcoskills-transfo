# Migration du graphe de compétences

Source : ancien dépôt (178 compétences uniques dans 7 parcours). Repris : **131**. Retirés : **47** (propres aux parcours IA agentique et Sylva, hors périmètre). Prérequis supprimés car pointant vers une compétence retirée : 0. Ressources écartées faute d'adresse : 10. Types renommés : libre → opensource, retour-experience → doc, livre → cours.

## Repris, par domaine
- fondations : 12
- kubernetes : 18
- reseau : 9
- performance : 4
- stockage : 5
- exploitation : 20
- securite : 20
- coeur-5g : 22
- gouvernance : 6
- livraison : 15

## Retirés
- ia-llm-bases : Grands modèles de langage : comment ça marche (ia-agentique-telco)
- ia-modeles-ouverts : Modèles à poids ouverts, licences et provenance (ia-agentique-telco)
- ia-quantification : Quantification et formats de modèles (ia-agentique-telco)
- inf-local : Inférence locale : Ollama et llama.cpp (ia-agentique-telco)
- inf-vllm : Serveur d'inférence vLLM (ia-agentique-telco)
- inf-kserve : Déployer des modèles avec KServe (ia-agentique-telco)
- inf-llm-d : Inférence distribuée et routage intelligent (llm-d) (ia-agentique-telco)
- inf-bench : Mesurer et dimensionner l'inférence (ia-agentique-telco)
- gpu-operator : GPU sur Kubernetes : pilotes et opérateurs (ia-agentique-telco)
- gpu-partage : Partage de GPU : MIG, temps partagé, allocation dynamique (ia-agentique-telco)
- gpu-ordonnancement : Files d'attente et ordonnancement par lots (Kueue) (ia-agentique-telco)
- gpu-reseau : Réseau haut débit pour l'IA (RDMA, SR-IOV) (ia-agentique-telco)
- ag-bases : Agents : boucle, outils, mémoire (ia-agentique-telco)
- ag-mcp : Model Context Protocol (MCP) (ia-agentique-telco)
- ag-a2a : Dialogue entre agents (A2A) (ia-agentique-telco)
- ag-frameworks : Cadres de développement d'agents (ia-agentique-telco)
- ag-garde-fous : Garde-fous : droits minimaux et humain dans la boucle (ia-agentique-telco)
- rag-bases : RAG : donner de la connaissance à un modèle (ia-agentique-telco)
- rag-vectoriel : Bases vectorielles : pgvector, Qdrant, Milvus (ia-agentique-telco)
- rag-evaluation : Évaluer un RAG (ia-agentique-telco)
- llmops-gateway : Passerelle d'accès aux modèles (ia-agentique-telco)
- llmops-obs : Observabilité des applications d'IA (ia-agentique-telco)
- llmops-eval : Évaluation continue des modèles (ia-agentique-telco)
- ia-sec-owasp : Menaces propres à l'IA générative (ia-agentique-telco)
- reg-ia-anssi : Recommandations de l'ANSSI pour l'IA générative (ia-agentique-telco)
- reg-ai-act : Règlement européen sur l'IA (AI Act) (ia-agentique-telco)
- tel-ia-usecases : Cas d'usage de l'IA dans un réseau télécom (ia-agentique-telco)
- tel-nwdaf : NWDAF : l'analytique du cœur 5G (ia-agentique-telco)
- tel-aiops : AIOps : diagnostic assisté d'un cluster (ia-agentique-telco)
- tel-agent-noc : Agent d'assistance au NOC et à l'astreinte (ia-agentique-telco)
- tel-camara : Ouverture des capacités réseau (CAMARA) (ia-agentique-telco)
- tel-edge-inference : Inférence en périphérie du réseau (edge) (ia-agentique-telco)
- sylva-projet : Le projet Sylva : une pile cloud télécom commune (parcours-sylva)
- sylva-architecture : Cluster de gestion, clusters de charge et units (parcours-sylva)
- cluster-api : Cluster API : le cycle de vie des clusters (parcours-sylva)
- sylva-units : Le chart sylva-units : activer et configurer des units (parcours-sylva)
- sylva-bootstrap : VM de bootstrap et prérequis du déploiement (parcours-sylva)
- sylva-fournisseurs : Fournisseurs d'infrastructure et distributions Kubernetes (parcours-sylva)
- sylva-metal3 : Bare metal avec Metal3 (CAPM3) (parcours-sylva)
- sylva-suse : La variante SUSE de Sylva : SL Micro, RKE2, Rancher, Longhorn, NeuVector (parcours-sylva)
- sylva-installation : Déployer et valider le cluster de gestion (parcours-sylva)
- sylva-clusters-charge : Créer des clusters de charge : du script à SylvaWorkloadCluster (parcours-sylva)
- sylva-upgrade : Monter de version Kubernetes (parcours-sylva)
- sylva-services : Les services de la plateforme : Rancher, Keycloak, Harbor, Vault, Flux, Thanos (parcours-sylva)
- sylva-observabilite : Journaux et supervision dans Sylva (parcours-sylva)
- sylva-securite : Sécurité : signatures d'images, PKI, NeuVector, SBOM, WireGuard (parcours-sylva)
- sylva-node-classes : Classes de nœuds : generic, intensive, SR-IOV (parcours-sylva)
