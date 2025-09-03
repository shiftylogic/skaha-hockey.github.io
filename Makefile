init:
	podman machine init
	podman machine start

cleanup:
	podman rmi --all
	podman machine stop
	podman machine reset --force

start:
	podman machine start

stop:
	podman machine stop

up:
	podman compose up --build -d

down:
	podman compose down

logs:
	podman compose logs --follow
