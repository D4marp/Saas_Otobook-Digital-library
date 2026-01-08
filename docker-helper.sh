#!/bin/bash

# OTobook Docker Helper Script

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
show_menu() {
    echo -e "\n${BLUE}=== OTobook Docker Manager ===${NC}\n"
    echo "1. Start containers (build + up)"
    echo "2. Stop containers"
    echo "3. Restart containers"
    echo "4. View logs (all)"
    echo "5. View logs (backend)"
    echo "6. View logs (frontend)"
    echo "7. View logs (mysql)"
    echo "8. Show container status"
    echo "9. Remove containers and volumes"
    echo "10. Clean up everything (⚠️  WARNING: deletes volumes)"
    echo "0. Exit"
    echo ""
}

start_containers() {
    echo -e "${YELLOW}Starting containers...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✓ Containers started!${NC}"
    echo -e "Frontend: http://localhost"
    echo -e "Backend: http://localhost:3001"
    echo -e "MySQL: localhost:3306"
}

stop_containers() {
    echo -e "${YELLOW}Stopping containers...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ Containers stopped!${NC}"
}

restart_containers() {
    echo -e "${YELLOW}Restarting containers...${NC}"
    docker-compose restart
    echo -e "${GREEN}✓ Containers restarted!${NC}"
}

view_logs() {
    case $1 in
        1) docker-compose logs -f ;;
        2) docker-compose logs -f backend ;;
        3) docker-compose logs -f frontend ;;
        4) docker-compose logs -f mysql ;;
    esac
}

show_status() {
    echo -e "${BLUE}Container Status:${NC}\n"
    docker-compose ps
    
    echo -e "\n${BLUE}Network Status:${NC}\n"
    docker network ls | grep otobook
    
    echo -e "\n${BLUE}Volumes:${NC}\n"
    docker volume ls | grep otobook
}

remove_containers() {
    echo -e "${YELLOW}Removing containers (keeping volumes)...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ Containers removed!${NC}"
}

cleanup_all() {
    echo -e "${RED}WARNING: This will delete all containers, volumes, and networks!${NC}"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        docker-compose down -v
        echo -e "${GREEN}✓ All cleanup complete!${NC}"
    else
        echo "Cleanup cancelled."
    fi
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice: " choice
    
    case $choice in
        1) start_containers ;;
        2) stop_containers ;;
        3) restart_containers ;;
        4) view_logs 1 ;;
        5) view_logs 2 ;;
        6) view_logs 3 ;;
        7) view_logs 4 ;;
        8) show_status ;;
        9) remove_containers ;;
        10) cleanup_all ;;
        0) echo "Goodbye!"; exit 0 ;;
        *) echo -e "${RED}Invalid choice!${NC}" ;;
    esac
done
